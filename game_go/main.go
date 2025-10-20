package main

import (
	"log"
	"net/http"
	"time"
	"encoding/json"

	"github.com/gorilla/websocket"
)

type Player struct {
	X     float64 `json:"X"`
	Y     float64 `json:"Y"`
	Score int     `json:"Score"`
}

type GameState struct {
    BallX   float64 `json:"BallX"`
    BallY   float64 `json:"BallY"`
	Player1      Player  `json:"Player1"`
	Player2      Player  `json:"Player2"`
	Winner       string  `json:"Winner,omitempty"`
}

type MoveMessage struct {
	Type   string `json:"type"`
	Player string `json:"player"`
	Action string `json:"action"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade error:", err)
		return
	}
	defer conn.Close()

	player1 := Player{X: 50, Y: 200, Score: 0}
	player2 := Player{X: 750, Y: 200, Score: 0}

	// ボール初期位置と速度（float64）
	ballX, ballY := 400.0, 200.0
	ballVX, ballVY := 3.0, 2.0 // 初期速度

	// クライアント入力処理
	go func() {
		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				log.Println("read error:", err)
				return
			}
			var move MoveMessage
			if err := json.Unmarshal(msg, &move); err != nil {
				log.Println("invalid move message:", err)
				continue
			}

			switch move.Player {
			case "1":
				if move.Action == "up" {
					player1.Y -= 5
					if player1.Y < 25 {
						player1.Y = 25
					}
				} else if move.Action == "down" {
					player1.Y += 5
					if player1.Y > 375 {
						player1.Y = 375
					}
				}
			case "2":
				if move.Action == "up" {
					player2.Y -= 5
					if player2.Y < 25 {
						player2.Y = 25
					}
				} else if move.Action == "down" {
					player2.Y += 5
					if player2.Y > 375 {
						player2.Y = 375
					}
				}
			}
		}
	}()

	ticker := time.NewTicker(16 * time.Millisecond)
	defer ticker.Stop()

	for range ticker.C {
		// ボール移動
		ballX += ballVX
		ballY += ballVY

		// 壁で跳ね返り
		if ballY < 10 || ballY > 390 {
			ballVY = -ballVY
		}

		// パドル衝突判定
		if ballX <= player1.X+5 && ballY >= player1.Y-25 && ballY <= player1.Y+25 {
			ballVX = -ballVX
			ballX = player1.X + 6
		}
		if ballX >= player2.X-5 && ballY >= player2.Y-25 && ballY <= player2.Y+25 {
			ballVX = -ballVX
			ballX = player2.X - 6
		}

		// 得点判定
		var winner string
		if ballX < 0 {
			player2.Score++
			ballX, ballY = 400.0, 200.0
			ballVX, ballVY = 3.0, 2.0
		} else if ballX > 800 {
			player1.Score++
			ballX, ballY = 400.0, 200.0
			ballVX, ballVY = -3.0, 2.0
		}

		// 5点先取で勝利
		if player1.Score >= 5 {
			winner = "Player1"
		} else if player2.Score >= 5 {
			winner = "Player2"
		}

		state := GameState{
			BallX:  ballX,
			BallY:  ballY,
			Player1: player1,
			Player2: player2,
			Winner:  winner,
		}

		if err := conn.WriteJSON(state); err != nil {
			log.Println("write error:", err)
			log.Println("Sending:", state)
			return
		}

		// 勝者が出たらゲーム停止
		if winner != "" {
			return
		}
	}
}

func main() {
	http.HandleFunc("/ws", wsHandler)
	log.Println("Test WS server started on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
