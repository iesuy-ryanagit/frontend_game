package handlers

import (
	"github.com/gin-gonic/gin"
)

func LogoutHandler(c *gin.Context) {
    c.SetCookie("jwt", "", -1, "/", "localhost", false, true) // maxAge=-1 で削除
    c.JSON(200, gin.H{"status": "success"})
}
