// handlers/select_avatar.go
package handlers

import (
	"net/http"
	"account_go/models"
	"account_go/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// 選択リクエスト: { "avatar_id": 2 }
func SelectAvatarHandler(c *gin.Context, db *gorm.DB) {
	jwtCookie, err := c.Cookie("jwt")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "detail": "jwt not found"})
		return
	}

	username, err := utils.VerifyJWT(jwtCookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "detail": "invalid token"})
		return
	}

	var req struct {
		AvatarID int `json:"avatar_id"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "detail": "invalid request"})
		return
	}

	// id → urlマップ
	avatarMap := map[int]string{
		1: "/static/avatars/goblin.png",
		2: "/static/avatars/mimic.png",
		3: "/static/avatars/slime.png",
	}

	url, ok := avatarMap[req.AvatarID]
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "detail": "invalid avatar id"})
		return
	}

	// DB更新
	db.Model(&models.User{}).Where("username = ?", username).Update("avatar_url", url)

	c.JSON(http.StatusOK, gin.H{"status": "success", "avatar_url": url})
}
