package models

import (
	"time"

	"gorm.io/gorm"
)

type Admin struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	Username         string         `gorm:"unique;not null" json:"username"`
	Email            string         `gorm:"unique;not null" json:"email"`
	Password         string         `gorm:"not null" json:"-"`
	Role             string         `gorm:"default:admin" json:"role"`
	ResetToken       string         `gorm:"size:255" json:"-"`
	ResetTokenExpiry *time.Time     `gorm:"default:null" json:"-"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}
