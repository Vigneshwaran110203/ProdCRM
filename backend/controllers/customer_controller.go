package controllers

import (
	"net/http"
	"prod-crm/models"
	"prod-crm/utils"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CustomerHandler struct {
	DB *gorm.DB
}

func NewCustomerHandler(db *gorm.DB) *CustomerHandler {
	return &CustomerHandler{DB: db}
}

func (h *CustomerHandler) CreateCustomer(ctx *gin.Context) {
	var customer models.Customer

	if err := ctx.ShouldBindJSON(&customer); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Input")
		return
	}

	if err := h.DB.Create(&customer).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create Customer")
		return
	}

	utils.SuccessResponse(ctx, "Customer Added Successfully", customer)
}

func (h *CustomerHandler) GetCustomers(ctx *gin.Context) {
	var customers []models.Customer
	if err := h.DB.Find(&customers).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch customers")
		return
	}

	utils.SuccessResponse(ctx, "Customer fetched successfully", customers)
}

func (h *CustomerHandler) GetCustomer(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var customer models.Customer
	if err := h.DB.First(&customer, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Customer Not found")
		return
	}

	utils.SuccessResponse(ctx, "Customer Found", customer)
}

func (h *CustomerHandler) UpdateCustomer(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var customer models.Customer
	if err := h.DB.First(&customer, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Customer Not found")
		return
	}

	if err := ctx.ShouldBindJSON(&customer); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Input")
		return
	}

	if err := h.DB.Save(&customer).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Update Customer")
		return
	}

	utils.SuccessResponse(ctx, "Customer Updated", customer)
}

func (h *CustomerHandler) DeleteCustomer(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := h.DB.Delete(&models.Customer{}, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Delete Customer")
		return
	}

	utils.SuccessResponse(ctx, "Customer Deleted", nil)
}
