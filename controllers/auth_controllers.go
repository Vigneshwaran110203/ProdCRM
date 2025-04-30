package controllers

import (
	"fmt"
	"net/http"
	"prod-crm/models"
	"prod-crm/utils"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthController struct {
	DB *gorm.DB
}

func NewAuthController(db *gorm.DB) AuthController {
	return AuthController{DB: db}
}

func (ac *AuthController) Register(ctx *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Error hashing Password")
		return
	}

	admin := models.Admin{
		Username: input.Username,
		Email:    input.Email,
		Password: hashedPassword,
	}

	if err := ac.DB.Create(&admin).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Email or username already exists")
		return
	}

	utils.SuccessResponse(ctx, "Registration Successful", gin.H{
		"id":    admin.ID,
		"email": admin.Email,
	})
}

func (ac *AuthController) Login(ctx *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var admin models.Admin
	if err := ac.DB.Where("email = ?", input.Email).First(&admin).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	if !utils.CheckPasswordHash(input.Password, admin.Password) {
		utils.ErrorResponse(ctx, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	token, err := utils.GenerateJWT(admin.ID)
	if err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	ctx.SetCookie(
		"crm_token",
		token,
		3600*24,
		"/",
		"",
		false,
		true,
	)

	utils.SuccessResponse(ctx, "login successfully", gin.H{
		"token": token,
	})
}

func (ac *AuthController) ForgotPassword(ctx *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid email")
		return
	}

	var admin models.Admin
	if err := ac.DB.Where("email = ?", input.Email).First(&admin).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Email not found")
		return
	}

	// Generate reset token and expiry (30 minutes from now)
	token := uuid.NewString()
	expiry := time.Now().Add(30 * time.Minute)

	admin.ResetToken = token
	admin.ResetTokenExpiry = &expiry // ✅ Set it correctly as a pointer

	if err := ac.DB.Save(&admin).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to save reset token")
		return
	}

	if err := utils.SendResetEmail(admin.Email, token); err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to send email")
		return
	}

	utils.SuccessResponse(ctx, "Reset link sent to email", nil)
}

func (ac *AuthController) ResetPassword(ctx *gin.Context) {
	resetToken := ctx.Param("token")

	var input struct {
		NewPassword string `json:"new_password" binding:"required,min=6"`
	}
	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Password is required")
		return
	}

	var admin models.Admin
	if err := ac.DB.
		Where("reset_token = ? AND reset_token_expiry IS NOT NULL AND reset_token_expiry > ?", resetToken, time.Now()).
		First(&admin).Error; err != nil {
		fmt.Println(err)
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid or expired token")
		return
	}

	hashed, err := utils.HashPassword(input.NewPassword)
	if err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Error hashing password")
		return
	}

	admin.Password = hashed
	admin.ResetToken = ""
	admin.ResetTokenExpiry = nil

	if err := ac.DB.Save(&admin).Error; err != nil {
		fmt.Println(err)
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to reset password")
		return
	}

	utils.SuccessResponse(ctx, "Password reset successful", nil)
}
