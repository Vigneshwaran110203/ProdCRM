package models

import (
	"time"
)

type Order struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CustomerID  uint           `json:"customer_id"`
	EmployeeID  uint           `json:"employee_id"`
	OrderDate   time.Time      `json:"order_date"`
	TotalAmount float64        `json:"total_amount"`
	Status      string         `json:"status"`
	Products    []OrderProduct `json:"products" gorm:"-"`
}

type OrderProduct struct {
	OrderID   uint `json:"order_id"`
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}
