package controllers

import (
	"fmt"
	"net/http"
	"prod-crm/models"
	"prod-crm/utils"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OrderHandler struct {
	DB *gorm.DB
}

func NewOrderHandler(db *gorm.DB) *OrderHandler {
	return &OrderHandler{DB: db}
}

func (h *OrderHandler) CreateOrder(ctx *gin.Context) {
	var input struct {
		CustomerID uint                  `json:"customer_id"`
		EmployeeID uint                  `json:"employee_id"`
		Status     string                `json:"status"`
		Products   []models.OrderProduct `json:"products"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Request")
		fmt.Println(err)
		return
	}

	var total float64 = 0
	for _, p := range input.Products {
		var product models.Product
		if err := h.DB.First(&product, p.ProductID).Error; err != nil {
			utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Product ID")
			return
		}
		total += product.Price * float64(p.Quantity)
	}

	order := models.Order{
		CustomerID:  input.CustomerID,
		EmployeeID:  input.EmployeeID,
		OrderDate:   time.Now(),
		TotalAmount: total,
		Status:      input.Status,
	}

	if err := h.DB.Create(&order).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Order Creation Failed")
		return
	}

	for _, p := range input.Products {
		err := h.DB.Exec(`
			INSERT INTO order_products (order_id, product_id, quantity) VALUES (?,?,?)`,
			order.ID, p.ProductID, p.Quantity,
		).Error
		if err != nil {
			utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to link products")
			return
		}
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message":  "order created",
		"order_id": order.ID,
	})
}

func (h *OrderHandler) UpdateOrder(ctx *gin.Context) {
	orderID, _ := strconv.Atoi(ctx.Param("id"))

	var input struct {
		CustomerID uint                  `json:"customer_id"`
		EmployeeID uint                  `json:"employee_id"`
		Status     string                `json:"status"`
		Products   []models.OrderProduct `json:"products"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Input")
		return
	}

	var order models.Order
	if err := h.DB.First(&order, orderID).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusNotFound, "Order Not Found")
		return
	}

	var total float64 = 0
	for _, p := range input.Products {
		var product models.Product
		if err := h.DB.First(&product, p.ProductID).Error; err != nil {
			utils.ErrorResponse(ctx, http.StatusBadRequest, "Invalid Product ID")
			return
		}
		total += product.Price * float64(p.Quantity)
	}

	order.CustomerID = input.CustomerID
	order.EmployeeID = input.EmployeeID
	order.Status = input.Status
	order.TotalAmount = total

	if err := h.DB.Save(&order).Error; err != nil {
		fmt.Println(err)
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Update Order")
		return
	}

	if err := h.DB.Exec("DELETE FROM order_products WHERE order_id = ?", order.ID).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to reset Order Products")
		return
	}

	for _, p := range input.Products {
		if err := h.DB.Exec(`INSERT INTO order_products (order_id, product_id, quantity) VALUES (?,?,?)`, order.ID, p.ProductID, p.Quantity).Error; err != nil {
			utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to update order items")
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Order updated successfully", "order_id": order.ID})
}

func (h *OrderHandler) GetOrders(ctx *gin.Context) {
	var orders []models.Order
	if err := h.DB.Find(&orders).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch orders")
		return
	}
	// Now load products for each order
	for i := range orders {
		var orderProducts []models.OrderProduct
		if err := h.DB.Where("order_id = ?", orders[i].ID).Find(&orderProducts).Error; err != nil {
			utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch products for orders")
			return
		}
		orders[i].Products = orderProducts
	}
	utils.SuccessResponse(ctx, "Orders fetched successfully", orders)
}

func (h *OrderHandler) DeleteOrder(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := h.DB.Delete(&models.Order{}, id).Error; err != nil {
		utils.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Delete Order")
		return
	}
	utils.SuccessResponse(ctx, "Order Deleted", nil)
}
