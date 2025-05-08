package routes

import (
	"prod-crm/controllers"
	"prod-crm/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterCustomerRoutes(r *gin.Engine, db *gorm.DB) {
	customerHandler := controllers.NewCustomerHandler(db)
	customerGroup := r.Group("/api/customers")
	customerGroup.Use(middlewares.AuthMiddleware())
	{
		customerGroup.POST("", customerHandler.CreateCustomer)
		customerGroup.GET("", customerHandler.GetCustomers)
		customerGroup.GET("/:id", customerHandler.GetCustomer)
		customerGroup.PUT("/:id", customerHandler.UpdateCustomer)
		customerGroup.DELETE("/:id", customerHandler.DeleteCustomer)
	}
}
