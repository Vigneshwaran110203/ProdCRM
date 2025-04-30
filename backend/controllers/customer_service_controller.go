package controllers

import (
	"net/http"
	"prod-crm/models"
	"prod-crm/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CustomerServiceHandler struct {
	DB *gorm.DB
}

func NewCustomerServiceHandler(db *gorm.DB) *CustomerServiceHandler {
	return &CustomerServiceHandler{DB: db}
}

func (h *CustomerServiceHandler) AssignService(ctx *gin.Context) {
	var input models.CustomerService
	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Input")
		return
	}

	if err := h.DB.Exec(`INSERT INTO customer_services (customer_id, service_id) VALUES (?,?)`, input.CustomerID, input.ServiceID).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to assign service")
		return
	}

	utils.SuccessResponse(ctx, "Service assigned to customer", nil)
}

func (h *CustomerServiceHandler) GetCustomerServices(ctx *gin.Context) {
	customerID := ctx.Param("id")

	var services []models.Service

	if err := h.DB.Raw(`
		SELECT s.* FROM services s
		JOIN customer_services cs ON s.id = cs.service_id
		WHERE cs.customer_id = ?`, customerID).Scan(&services).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch services for customer")
		return
	}

	utils.SuccessResponse(ctx, "Fetched the Services for Customer", services)
}

func (h *CustomerServiceHandler) RemoveService(ctx *gin.Context) {
	customerID := ctx.Param("customer_id")
	serviceID := ctx.Param("service_id")

	if err := h.DB.Exec(`
		DELETE FROM customer_services
		WHERE customer_id = ? AND service_id = ?`, customerID, serviceID).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Remove Service from Customer")
		return
	}

	utils.SuccessResponse(ctx, "Service Removed from customer", nil)
}
