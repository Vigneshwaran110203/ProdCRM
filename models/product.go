package models

import "time"

type Product struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	Name              string    `gorm:"not null" json:"name"`
	Description       string    `json:"description"`
	Price             float64   `gorm:"not null" json:"price"`
	QuantityAvailable int       `gorm:"default:0" json:"quantity_available"`
	CreatedAt         time.Time `json:"created_at"`
}
