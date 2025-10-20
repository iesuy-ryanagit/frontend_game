package main

import (
    "account_go/handlers"
    "account_go/models"
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    "time"
    "os"
)

func main() {
    db, err := gorm.Open(sqlite.Open("/app/users.db"), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }

    db.AutoMigrate(&models.User{})

    router := gin.Default()

    // ✅ CORS設定を一括で追加
    frontendURL := os.Getenv("FRONTEND_URL")
	frontendURL = "http://localhost:3000" // ローカル開発用デフォルト値
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{frontendURL},
        AllowMethods:     []string{"POST", "GET", "PUT", "DELETE","PATCH","OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    // ハンドラ登録
    router.POST("/signup", func(c *gin.Context) {
        handlers.SignupHandler(c, db)
    })

    router.POST("/login", func(c *gin.Context) {
        handlers.LoginHandler(c, db)
    })

	router.GET("/profile", func(c *gin.Context) {
		handlers.ProfileHandler(c, db)
	})

	router.POST("/logout", handlers.LogoutHandler)

	router.GET("/avatar/list", handlers.GetAvatarListHandler)
	
	router.PATCH("/avatar/select", func(c *gin.Context) {
		handlers.SelectAvatarHandler(c, db)
	})

	router.Static("/static", "./static")
	
    router.Run(":8080")
}
