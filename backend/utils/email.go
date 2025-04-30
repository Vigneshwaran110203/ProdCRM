package utils

import (
	"fmt"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

func SendResetEmail(toEmail, resetToken string) error {
	host := os.Getenv("SMTP_HOST")
	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	username := os.Getenv("SMTP_USERNAME")
	password := os.Getenv("SMTP_PASSWORD")

	resetLink := fmt.Sprintf("%s/%s", os.Getenv("RESET_URL"), resetToken)

	m := gomail.NewMessage()
	m.SetHeader("From", username)
	m.SetHeader("To", toEmail)
	m.SetHeader("Subject", "CRM Password Reset")
	m.SetBody("text/plain", fmt.Sprintf("Click to reset your password: %s", resetLink))

	d := gomail.NewDialer(host, port, username, password)
	return d.DialAndSend(m)
}
