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

type ProductHandler struct {
	DB *gorm.DB
}

func NewProductHandler(db *gorm.DB) *ProductHandler {
	return &ProductHandler{DB: db}
}

func (h *ProductHandler) CreateProduct(ctx *gin.Context) {
	var product models.Product
	if err := ctx.ShouldBindJSON(&product); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Input")
		return
	}
	if err := h.DB.Create(&product).Error; err != nil {
		fmt.Print("Error : ", err)
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create product")
		return
	}
	utils.SuccessResponse(ctx, "Product Created", product)
}

func (h *ProductHandler) GetProducts(ctx *gin.Context) {
	var products []models.Product
	if err := h.DB.Find(&products).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch products")
		return
	}
	utils.SuccessResponse(ctx, "Product Created", products)
}

func (h *ProductHandler) GetProduct(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var product models.Product
	if err := h.DB.First(&product, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Product Not Found")
		return
	}
	utils.SuccessResponse(ctx, "Product Found", product)
}

func (h *ProductHandler) UpdateProduct(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var product models.Product
	if err := h.DB.First(&product, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Product Not found")
		return
	}
	if err := ctx.ShouldBindJSON(&product); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Input")
		return
	}
	if err := h.DB.Save(&product).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Update Product")
		return
	}
	utils.SuccessResponse(ctx, "Updated the Product Successfully", product)
}

func (h *ProductHandler) DeleteProduct(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := h.DB.Delete(&models.Product{}, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to delete product")
		return
	}
	utils.SuccessResponse(ctx, "Product Deleted Sucessfuly", nil)
}
