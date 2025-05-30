package routes

import (
	"prod-crm/controllers"
	"prod-crm/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthRoutes(r *gin.Engine, db *gorm.DB) {
	auth := controllers.NewAuthController(db)
	authGroup := r.Group("/api/auth")
	{
		authGroup.POST("/register", auth.Register)
		authGroup.POST("/login", auth.Login)
		authGroup.POST("/forgot-password", auth.ForgotPassword)
		authGroup.POST("/reset-password/:token", auth.ResetPassword)
		authGroup.POST("/google-login", auth.GoogleLogin)
		authGroup.GET("/setup-2fa", middlewares.AuthMiddleware(), auth.Setup2FA)
		authGroup.POST("/enable-2fa", middlewares.AuthMiddleware(), auth.Enable2FA)
		authGroup.POST("/verify-2fa", auth.Verify2FA)
		authGroup.POST("/reset-2fa", middlewares.AuthMiddleware(), auth.Reset2FA)
		authGroup.GET("/check-session", middlewares.AuthMiddleware(), auth.CheckSession)
		authGroup.POST("/logout", middlewares.AuthMiddleware(), controllers.Logout)
	}
}
