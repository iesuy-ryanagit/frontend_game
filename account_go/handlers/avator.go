package handlers

import (
	"fmt"
	"net/http"
	"account_go/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"account_go/utils"
)

func UploadAvatarHandler(c *gin.Context, db *gorm.DB) {
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

    file, err := c.FormFile("avatar")
    if err != nil {
        c.JSON(400, gin.H{"status": "error", "detail": "no file"})
        return
    }

    // 保存先: ./uploads/username_filename
    dst := fmt.Sprintf("./uploads/%s_%s", username, file.Filename)
    if err := c.SaveUploadedFile(file, dst); err != nil {
        c.JSON(500, gin.H{"status": "error", "detail": "failed to save"})
        return
    }

    avatarURL := "/uploads/" + username + "_" + file.Filename

    // DB更新
    db.Model(&models.User{}).Where("username = ?", username).Update("avatar_url", avatarURL)

    c.JSON(200, gin.H{"status": "success", "avatar": avatarURL})
}
