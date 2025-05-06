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
		authGroup.GET("/check-session", middlewares.AuthMiddleware(), controllers.CheckSession)
	}
}
