package models

import "time"

type CustomerService struct {
	CustomerID   uint      `json:"customer_id"`
	ServiceID    uint      `json:"service_id"`
	SubscribedAt time.Time `json:"subscribed_at"`
}
