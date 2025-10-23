package handlers

import (
    "net/http"
    "account_go/models"
    "account_go/utils"

    "golang.org/x/crypto/bcrypt"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type LoginRequest struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required"`
}

func LoginHandler(c *gin.Context, db *gorm.DB) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "detail": "invalid request"})
        return
    }

    var user models.User
    if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "detail": "user not found"})
        return
    }

    // OTPが有効な場合は拒否
    if user.OtpEnabled {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "detail": "otp required"})
        return
    }

    // パスワードチェック
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "detail": "invalid password"})
        return
    }

    // JWT生成
    token, err := utils.GenerateJWT(user.Username)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "detail": "jwt error"})
        return
    }

    // Cookieに設定
    cookie := &http.Cookie{
        Name:     "jwt",
        Value:    token,
        Path:     "/",
        MaxAge:   86400,      // 1日
        HttpOnly: true,       // JSアクセス禁止
        Secure:   true,       // HTTPS限定（本番環境用）
        SameSite: http.SameSiteNoneMode, // クロスサイトで送信可能に
    }
    http.SetCookie(c.Writer, cookie)

    c.JSON(http.StatusOK, gin.H{
        "status": "success",
        "jwt":    token,
    })
}
