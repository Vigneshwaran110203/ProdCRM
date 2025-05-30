package controllers

import (
	"fmt"
	"net/http"
	"os"
	"prod-crm/models"
	"prod-crm/utils"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/pquerna/otp/totp"
	"google.golang.org/api/idtoken"
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

	if admin.TwoFAEnabled {
		// Don't issue token yet
		ctx.JSON(http.StatusOK, gin.H{
			"require_2fa": true,
			"user_id":     admin.ID,
		})
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

func (ac *AuthController) GoogleLogin(ctx *gin.Context) {
	var input struct {
		IDToken string `json:"id_token" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "ID token is required")
		return
	}

	// Validate Google ID token
	payload, err := idtoken.Validate(ctx, input.IDToken, os.Getenv("GOOGLE_CLIENT_ID"))
	if err != nil {
		utils.ErrorResponse(ctx, http.StatusUnauthorized, "Invalid Google token")
		return
	}

	email := fmt.Sprintf("%v", payload.Claims["email"])
	if email == "" {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Email not found in token")
		return
	}

	var admin models.Admin
	if err := ac.DB.Where("email = ?", email).First(&admin).Error; err != nil {
		// Optional: auto-register admin or reject
		admin = models.Admin{
			Email:    email,
			Username: strings.Split(email, "@")[0],
			Role:     "admin", // or default role
		}
		if err := ac.DB.Create(&admin).Error; err != nil {
			utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to auto-create admin")
			return
		}
	}

	token, err := utils.GenerateJWT(admin.ID)
	if err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to generate JWT")
		return
	}

	ctx.SetCookie("crm_token", token, 3600*24, "/", "", false, true)
	utils.SuccessResponse(ctx, "Google login successful", gin.H{
		"token": token,
	})
}

func (ac *AuthController) CheckSession(ctx *gin.Context) {
	adminID := ctx.MustGet("adminID").(uint)

	var admin models.Admin
	if err := ac.DB.First(&admin, adminID).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid session"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"isAuthenticated": true,
		"id":              admin.ID,
		"name":            admin.Username,
		"email":           admin.Email,
		"two_fa_enabled":  admin.TwoFAEnabled,
	})
}

func Logout(ctx *gin.Context) {
	ctx.SetCookie(
		"crm_token",
		"",    // clear the token
		-1,    // maxAge -1 deletes the cookie
		"/",   // path must match the original
		"",    // domain ("" means current domain)
		false, // secure (set true in production with HTTPS)
		true,  // httpOnly
	)
	ctx.JSON(200, gin.H{"message": "Logged out successfully"})
}

func (ac *AuthController) Setup2FA(ctx *gin.Context) {
	// Extract user ID from JWT
	fmt.Println("Context keys:", ctx.Keys)
	adminID := ctx.MustGet("adminID").(uint)

	var admin models.Admin
	if err := ac.DB.First(&admin, adminID).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Admin not found")
		return
	}

	// Generate new secret
	secret, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "CRM System",
		AccountName: admin.Email,
	})
	if err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to generate secret")
		return
	}

	// Save secret
	admin.TwoFASecret = secret.Secret()
	if err := ac.DB.Save(&admin).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to store secret")
		return
	}

	// Send QR code URL
	ctx.JSON(http.StatusOK, gin.H{"otp_auth_url": secret.URL()})
}

func (ac *AuthController) Enable2FA(ctx *gin.Context) {
	adminID := ctx.MustGet("adminID").(uint)

	var input struct {
		Code string `json:"code" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Code required")
		return
	}

	var admin models.Admin
	if err := ac.DB.First(&admin, adminID).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Admin not found")
		return
	}

	// Verify TOTP code
	if !totp.Validate(input.Code, admin.TwoFASecret) {
		utils.ErrorResponse(ctx, http.StatusUnauthorized, "Invalid 2FA code")
		return
	}

	admin.TwoFAEnabled = true
	ac.DB.Save(&admin)

	utils.SuccessResponse(ctx, "2FA Enabled", nil)
}

func (ac *AuthController) Verify2FA(ctx *gin.Context) {
	var input struct {
		AdminID uint   `json:"admin_id" binding:"required"`
		Code    string `json:"code" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid input")
		return
	}

	var admin models.Admin
	if err := ac.DB.First(&admin, input.AdminID).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusUnauthorized, "Admin not found")
		return
	}

	if !totp.Validate(input.Code, admin.TwoFASecret) {
		utils.ErrorResponse(ctx, http.StatusUnauthorized, "Invalid 2FA code")
		return
	}

	token, err := utils.GenerateJWT(admin.ID)
	if err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	ctx.SetCookie("crm_token", token, 3600*24, "/", "", false, true)
	utils.SuccessResponse(ctx, "2FA verified", gin.H{"token": token})
}

func (ac *AuthController) Reset2FA(ctx *gin.Context) {
	adminID := ctx.MustGet("adminID").(uint)

	var input struct {
		Password string `json:"password" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Password is required")
		return
	}

	var admin models.Admin
	if err := ac.DB.First(&admin, adminID).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Admin not found")
		return
	}

	if !utils.CheckPasswordHash(input.Password, admin.Password) {
		utils.ErrorResponse(ctx, http.StatusUnauthorized, "Incorrect password")
		return
	}

	admin.TwoFAEnabled = false
	admin.TwoFASecret = ""
	if err := ac.DB.Save(&admin).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Could not reset 2FA")
		return
	}

	utils.SuccessResponse(ctx, "2FA has been disabled", nil)
}