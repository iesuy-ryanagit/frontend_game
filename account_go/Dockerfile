FROM golang:1.24-bullseye AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server main.go

FROM debian:bullseye-slim
WORKDIR /app

# 必要最低限のアップデートとパッケージインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    sqlite3 && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/server .
COPY static ./static
EXPOSE 8080
CMD ["./server"]
