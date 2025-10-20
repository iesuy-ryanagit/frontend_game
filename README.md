# Re Pong

これは、42Tokyoの最終課題「ft_transcendence」の個人再実装プロジェクトです。
本家課題として行ったものは以下のリンクにあります。基本的な概要はそちらを参照してください。
https://github.com/iesuy-ryanagit/ft_transcendence_koko

本家課題では言語やフレームワークに制約がありましたが、
このプロジェクトではそれらを自由に選び、よりモダンかつ快適な環境を目指して再構築しています。

## 特徴

フロントエンドはNext.jsを採用
Reactベースの一般的なフレームワークを使用。

バックエンドはGoで実装
高速で軽量なGoを用いて、ゲーム処理やプロフィール取得処理などリアルタイム処理に強いサーバーを構築。

リアルタイム通信にWebSocketを利用
Pongゲームの快適なマルチプレイを実現。

認証はJWTトークンをHTTPOnly Cookieに格納
セキュリティ向上のため、JavaScriptから直接アクセスできないCookieにJWTを保存。

🎮 ゲーム概要

Pongゲームをブラウザ上でマルチプレイ可能にしたものです。
リアルタイムで操作を反映し、スムーズでストレスのないプレイ体験を実現しています。

🛠 技術スタック
レイヤー	技術・ツール
フロントエンド	Next.js, React
バックエンド	Go (Golang)
通信	WebSocket
認証	JWT + HTTPOnly Cookie
