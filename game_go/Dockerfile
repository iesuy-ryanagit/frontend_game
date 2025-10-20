# build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# まず go.mod / go.sum だけコピー（キャッシュが効く）
COPY go.mod go.sum ./

# 外部依存をここで取得
RUN go mod download

# アプリケーション本体をコピー
COPY . .

# ビルド
RUN CGO_ENABLED=0 GOOS=linux go build -o server main.go
RUN ls -lah /app

# run stage
FROM alpine:latest

WORKDIR /app
RUN apk --no-cache add ca-certificates

# ビルドしたバイナリをコピー
COPY --from=builder /app/server .


EXPOSE 8081

CMD ["./server"]
