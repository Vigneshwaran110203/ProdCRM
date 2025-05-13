package routes

import (
	"prod-crm/controllers"
	"prod-crm/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterOrderRoutes(r *gin.Engine, db *gorm.DB){
	orderHandler := controllers.NewOrderHandler(db)
	orderGroup := r.Group("/api/orders")
	orderGroup.Use(middlewares.AuthMiddleware())
	{
		orderGroup.POST("", orderHandler.CreateOrder)
		orderGroup.GET("", orderHandler.GetOrders)
		orderGroup.PUT("/:id", orderHandler.UpdateOrder)
		orderGroup.DELETE("/:id", orderHandler.DeleteOrder)
	}
}