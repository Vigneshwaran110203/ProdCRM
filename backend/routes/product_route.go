package routes

import (
	"prod-crm/controllers"
	"prod-crm/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterProductRoutes(r *gin.Engine, db *gorm.DB) {
	productHandler := controllers.NewProductHandler(db)
	productGroup := r.Group("/api/products")
	productGroup.Use(middlewares.AuthMiddleware())
	{
		productGroup.POST("", productHandler.CreateProduct)
		productGroup.GET("", productHandler.GetProducts)
		productGroup.GET("/:id", productHandler.GetProduct)
		productGroup.PUT("/:id", productHandler.UpdateProduct)
		productGroup.DELETE("/:id", productHandler.DeleteProduct)
	}
}
