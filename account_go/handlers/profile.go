package handlers
import (
	"net/http"
	"account_go/models"
	"account_go/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


func ProfileHandler(c *gin.Context, db *gorm.DB) {
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

    var user models.User
    if err := db.Where("username = ?", username).First(&user).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"status": "error", "detail": "user not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "detail": "db error"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "status":   "success",
        "username": user.Username,
		"avatar":   user.AvatarURL,
    })
}
