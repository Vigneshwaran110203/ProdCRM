package routes

import (
	"prod-crm/controllers"
	"prod-crm/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterCustomerServiceRoutes(r *gin.Engine, db *gorm.DB) {
	customerServiceHandler := controllers.NewCustomerServiceHandler(db)
	customerServiceGroup := r.Group("/api/customer-services")
	customerServiceGroup.Use(middlewares.AuthMiddleware())
	{
		customerServiceGroup.POST("/", customerServiceHandler.AssignService)
		customerServiceGroup.GET("/:id", customerServiceHandler.GetCustomerServices)
		customerServiceGroup.DELETE("/:customer_id/:service_id", customerServiceHandler.RemoveService)
	}
}
