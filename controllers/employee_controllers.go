package controllers

import (
	"fmt"
	"net/http"
	"prod-crm/models"
	"prod-crm/utils"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type EmployeeHandler struct {
	DB *gorm.DB
}

func NewEmployeeHandler(db *gorm.DB) *EmployeeHandler {
	return &EmployeeHandler{DB: db}
}

func (h *EmployeeHandler) AddEmployee(ctx *gin.Context) {
	var employee models.Employee

	if err := ctx.ShouldBindJSON(&employee); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Input")
		return
	}

	if err := models.CreateEmployee(h.DB, employee); err != nil {
		fmt.Println("Error : ", err)
		fmt.Println(employee)
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to add employee")
		return
	}

	utils.SuccessResponse(ctx, "Employee added successfully", employee)
}

func (h *EmployeeHandler) GetEmployees(ctx *gin.Context) {
	employees, err := models.GetAllEmployees(h.DB)
	if err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to retrieve employees")
		return
	}
	utils.SuccessResponse(ctx, "Employee retrieved successfully", employees)
}

func (h *EmployeeHandler) GetEmployeeByID(ctx *gin.Context) {

	idStr := ctx.Param("id")

	idUint64, err := strconv.ParseUint(idStr, 10, 32) // Base 10, up to 32-bit unsigned integer
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})
		return
	}
	idUint := uint(idUint64) // Convert uint64 to uint

	employee, err := models.GetEmployeeByID(h.DB, idUint)
	if err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Employee not found")
		return
	}
	utils.SuccessResponse(ctx, "Employee retrieved successfully", employee)
}

func (h *EmployeeHandler) UpdateEmployee(ctx *gin.Context) {
	idStr := ctx.Param("id")

	idUint64, err := strconv.ParseUint(idStr, 10, 32) // Base 10, up to 32-bit unsigned integer
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})
		return
	}
	idUint := uint(idUint64) // Convert uint64 to uint

	var updatedEmployee models.Employee

	if err := ctx.ShouldBindJSON(&updatedEmployee); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid input")
		return
	}

	if err := models.UpdateEmployee(h.DB, idUint, updatedEmployee); err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to update employee")
		return
	}

	utils.SuccessResponse(ctx, "Employee updated successfully", updatedEmployee)
}

func (h *EmployeeHandler) DeleteEmployee(ctx *gin.Context) {
	idStr := ctx.Param("id")

	idUint64, err := strconv.ParseUint(idStr, 10, 32) // Base 10, up to 32-bit unsigned integer
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})
		return
	}

	idUint := uint(idUint64) // Convert uint64 to uint

	if err := models.DeleteEmployee(h.DB, idUint); err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to delete employee")
		return
	}

	utils.SuccessResponse(ctx, "Employee deleted successfully", nil)
}
