package controllers

import (
	"net/http"
	"prod-crm/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DashboardHandler struct {
	DB *gorm.DB
}

func NewDashboardHandler(db *gorm.DB) *DashboardHandler {
	return &DashboardHandler{DB: db}
}

func (h *DashboardHandler) GetSummary(ctx *gin.Context) {
	db := h.DB

	var customerCount, employeeCount, orderCount, productCount, serviceCount int64
	var totalRevenue float64

	db.Model(&models.Customer{}).Count(&customerCount)
	db.Model(&models.Employee{}).Count(&employeeCount)
	db.Model(&models.Order{}).Count(&orderCount)
	db.Model(&models.Product{}).Count(&productCount)
	db.Model(&models.Service{}).Count(&serviceCount)
	db.Model(&models.Order{}).Select("SUM(total_amount)").Scan(&totalRevenue)

	var orderStatus []struct {
		Status string `json:"status"`
		Count  int64  `json:"count"`
	}
	db.Model(&models.Order{}).Select("status, COUNT(*) as count").Group("status").Scan(&orderStatus)

	var revenueData []struct {
		Month  string  `json:"month"`
		Amount float64 `json:"amount"`
	}
	db.Raw(`
		SELECT DATE_FORMAT(order_date, '%Y-%m') as month, SUM(total_amount) as amount
		FROM orders
		GROUP BY month
		ORDER BY month DESC
		LIMIT 6
	`).Scan(&revenueData)

	var topProducts []struct {
		ProductName string `json:"product_name"`
		Quantity    int64  `json:"quantity"`
	}
	db.Raw(`
		SELECT p.name AS product_name, SUM(op.quantity) AS quantity
		FROM order_products op
		JOIN products p ON p.id = op.product_id
		GROUP BY op.product_id
		ORDER BY quantity DESC
		LIMIT 5	
	`).Scan(&topProducts)

	var customerGrowth []struct {
		Month string `json:"month"`
		Count int64  `json:"count"`
	}
	db.Raw(`
		SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
		FROM customers
		GROUP BY month
		ORDER BY month DESC
		LIMIT 6
	`).Scan(&customerGrowth)

	ctx.JSON(http.StatusOK, gin.H{
		"totals": gin.H{
			"customers":     customerCount,
			"employees":     employeeCount,
			"orders":        orderCount,
			"products":      productCount,
			"services":      serviceCount,
			"total_revenue": totalRevenue,
		},
		"orders_by_status":     orderStatus,
		"monthly_revenue":      revenueData,
		"top_selling_products": topProducts,
		"customer_growth":      customerGrowth,
	})
}
