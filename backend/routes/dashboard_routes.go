package routes

import (
	"prod-crm/controllers"
	"prod-crm/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterDashboardRoutes(r *gin.Engine, db *gorm.DB) {
	dashboardHandler := controllers.NewDashboardHandler(db)
	dashboardroute := r.GET("/api/dashboard", dashboardHandler.GetSummary)
	dashboardroute.Use(middlewares.AuthMiddleware())
}
