package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString, err := ctx.Cookie("crm_token")
		if err != nil || tokenString == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorised: No token provided"})
			ctx.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrInvalidKey
			}
			return []byte("gh8fho1u7ba9"), nil
		})

		if err != nil || !token.Valid {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorised: Invalid token"})
			ctx.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorised: Invalid claims"})
			ctx.Abort()
			return
		}

		rawID, ok := claims["admin_id"]
		if !ok {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token claim: id"})
			ctx.Abort()
			return
		}

		var adminID uint
		switch v := rawID.(type) {
		case float64:
			adminID = uint(v)
		default:
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid admin ID format"})
			ctx.Abort()
			return
		}

		ctx.Set("adminID", adminID)
		ctx.Next()
	}
}

