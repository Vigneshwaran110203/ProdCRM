package utils

import "github.com/gin-gonic/gin"

func SuccessResponse(ctx *gin.Context, message string, data interface{}) {
	ctx.JSON(200, gin.H{
		"status":  true,
		"message": message,
		"data":    data,
	})
}

func ErrorResponse(ctx *gin.Context, code int, message string) {
	ctx.JSON(code, gin.H{
		"status":  false,
		"message": message,
	})
}
