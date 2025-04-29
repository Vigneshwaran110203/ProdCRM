package controllers

import (
	"net/http"
	"prod-crm/models"
	"prod-crm/utils"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ServiceHandler struct {
	DB *gorm.DB
}

func NewServiceHandler(db *gorm.DB) *ServiceHandler {
	return &ServiceHandler{DB: db}
}

func (h *ServiceHandler) CreateService(ctx *gin.Context) {
	var service models.Service
	if err := ctx.ShouldBindJSON(&service); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Input")
		return
	}
	if err := h.DB.Create(&service).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create service")
		return
	}
	utils.SuccessResponse(ctx, "Service Created", service)
}

func (h *ServiceHandler) GetServices(ctx *gin.Context) {
	var services []models.Service
	if err := h.DB.Find(&services).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch services")
		return
	}
	utils.SuccessResponse(ctx, "Service Fetch Successfully", services)
}

func (h *ServiceHandler) GetService(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var service models.Service
	if err := h.DB.First(&service, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Service Not Found")
		return
	}
	utils.SuccessResponse(ctx, "Service Found", service)
}

func (h *ServiceHandler) UpdateService(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var service models.Service
	if err := h.DB.First(&service, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Service Not Found")
		return
	}
	if err := ctx.ShouldBindJSON(&service); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Input")
		return
	}
	if err := h.DB.Save(&service).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to update Service")
		return
	}
	utils.SuccessResponse(ctx, "Service Updated", service)
}

func (h *ServiceHandler) DeleteService(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := h.DB.Delete(&models.Service{}, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to delete Service")
		return
	}
	utils.SuccessResponse(ctx, "Service Deleted", nil)
}
