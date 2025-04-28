package controllers

import (
	"net/http"
	"prod-crm/models"
	"prod-crm/utils"

	"github.com/gin-gonic/gin"
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

func (ac *AuthController) Login(ctx *gin.Context){
	var input struct{
		Email		string		`json:"email" binding:"required,email"`
		Password	string		`json:"password" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var admin models.Admin
	if err := ac.DB.Where("email = ?", input.Email).First(&admin).Error; err != nil{
		utils.ErrorResponse(ctx, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	if !utils.CheckPasswordHash(input.Password, admin.Password){
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

func (ac *AuthController) ForgotPassword(ctx *gin.Context){
	var input struct{
		Email string `json:"email" binding:"required,email"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	resetToken := "dummy-reset-token-for-" + input.Email

	utils.SuccessResponse(ctx, "Password reset token generated", gin.H{
		"reset_token": resetToken,
	})
}