package routes

import (
	"prod-crm/controllers"
	"prod-crm/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterServiceRoutes(r *gin.Engine, db *gorm.DB) {
	serviceHandler := controllers.NewServiceHandler(db)
	serviceGroup := r.Group("/api/services")
	serviceGroup.Use(middlewares.AuthMiddleware())
	{
		serviceGroup.POST("/", serviceHandler.CreateService)
		serviceGroup.GET("/", serviceHandler.GetServices)
		serviceGroup.GET("/:id", serviceHandler.GetService)
		serviceGroup.PUT("/:id", serviceHandler.UpdateService)
		serviceGroup.DELETE("/:id", serviceHandler.DeleteService)
	}
}
