// handlers/avatar_list.go
package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func GetAvatarListHandler(c *gin.Context) {
	avatars := []gin.H{
		{"id": 1, "name": "Warrior", "url": "/static/avatars/goblin.png"},
		{"id": 2, "name": "Mage", "url": "/static/avatars/mimic.png"},
		{"id": 3, "name": "Rogue", "url": "/static/avatars/slime.png"},
	}
	c.JSON(http.StatusOK, avatars)
}
