package main

import (
    "account_go/handlers"
    "account_go/models"
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "time"
    "os"
	"log"
	"fmt"
)

func main() {
	host := os.Getenv("DB_HOST")
    user := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    dbname := os.Getenv("DB_NAME")
    port := os.Getenv("DB_PORT")
    sslmode := os.Getenv("DB_SSLMODE")
    timezone := os.Getenv("DB_TIMEZONE")
	    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
        host, user, password, dbname, port, sslmode, timezone,
    )

	if dsn == "" {
        dsn = "host=localhost user=postgres password=secret dbname=account_app port=5432 sslmode=disable TimeZone=Asia/Tokyo"
    }
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("❌ failed to connect to database:", err)
    }
	db.AutoMigrate(&models.User{})

    db.AutoMigrate(&models.User{})

    router := gin.Default()

    // ✅ CORS設定を一括で追加
    frontendURL := os.Getenv("FRONTEND_URL")
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
