package models

import (
	"time"

	"gorm.io/gorm"
)

type Employee struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	FirstName  string    `gorm:"not null" json:"first_name"`
	LastName   string    `gorm:"not null" json:"last_name"`
	Email      string    `gorm:"unique;not null" json:"email"`
	Phone      string    `json:"phone"`
	Department string    `json:"department"`
	Position   string    `json:"position"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func CreateEmployee(db *gorm.DB, employee Employee) error {
	return db.Create(&employee).Error
}

func GetAllEmployees(db *gorm.DB) ([]Employee, error) {
	var employees []Employee
	err := db.Find(&employees).Error
	return employees, err
}

func GetEmployeeByID(db *gorm.DB, id uint) (Employee, error) {
	var employee Employee
	err := db.First(&employee, id).Error
	return employee, err
}

func UpdateEmployee(db *gorm.DB, id uint, updatedEmployee Employee) error {
	var employee Employee
	err := db.First(&employee, id).Error
	if err != nil {
		return err
	}

	err = db.Model(&employee).Updates(updatedEmployee).Error
	return err
}

func DeleteEmployee(db *gorm.DB, id uint) error {
	return db.Delete(&Employee{}, id).Error
}
