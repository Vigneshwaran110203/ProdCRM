package routes

import (
	"prod-crm/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func EmployeeRoutes(r *gin.Engine, db *gorm.DB){
	employeeHandler := controllers.NewEmployeeHandler(db)
	employeeGroup := r.Group("/api/employees")

	employeeGroup.POST("/", employeeHandler.AddEmployee)
	employeeGroup.GET("/", employeeHandler.GetEmployees)
	employeeGroup.GET("/:id", employeeHandler.GetEmployeeByID)
	employeeGroup.PUT("/:id", employeeHandler.UpdateEmployee)
	employeeGroup.DELETE("/:id", employeeHandler.DeleteEmployee)
}