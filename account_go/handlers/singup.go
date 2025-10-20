package handlers

import (
    "net/http"
    "account_go/models"
    "golang.org/x/crypto/bcrypt"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "log"
)

type SignupRequest struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required"`
}

func SignupHandler(c *gin.Context, db *gorm.DB) {
    var req SignupRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "detail": "invalid request"})
        return
    }

    // 既に存在するユーザーを確認
    var existing models.User
    if err := db.Where("username = ?", req.Username).First(&existing).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "detail": "user already exists"})
        return
    }

    // パスワードをハッシュ化
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        log.Println("bcrypt error:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "detail": "server error"})
        return
    }

    user := models.User{
        Username:   req.Username,
        Password:   string(hashedPassword),
        OtpEnabled: false,
    }

    if err := db.Create(&user).Error; err != nil {
        log.Println("DB error:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "detail": "database error"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"status": "success"})
}
