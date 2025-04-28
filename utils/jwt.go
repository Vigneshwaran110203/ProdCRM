package utils

import (
	"os"
	"time"

	// "github.com/dgrijalva/jwt-go"
	"github.com/golang-jwt/jwt"
)

func GenerateJWT(adminID uint) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	expireHours := os.Getenv("JWT_EXPIRE_HOURS")

	expirationTime := time.Now().Add(time.Hour * time.Duration(parseInt(expireHours))).Unix()

	claims := jwt.MapClaims{
		"admin_id": adminID,
		"exp":      expirationTime,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))
}

func parseInt(s string) int64 {
	val, _ := time.ParseDuration(s + "h")
	return int64(val.Hours())
}
