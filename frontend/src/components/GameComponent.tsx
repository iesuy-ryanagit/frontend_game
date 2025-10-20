"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
const frontBase= process.env.FRONTEND_URL || "";
const WS_PORT = 8081;


interface GameComponentProps {
  mode: "pvp" | "cpu" | "octopus";
}

interface Player {
  X: number;
  Y: number;
  Score: number;
}

interface GameState {
  BallX: number;
  BallY: number;
  Player1: Player;
  Player2: Player;
  Winner?: string;
}

export default function GameComponent({ mode }: GameComponentProps) {
  const auth = useAuth();
  const user = auth?.user;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  const [gameState, setGameState] = useState<GameState>({
    BallX: 400,
    BallY: 200,
    Player1: { X: 50, Y: 200, Score: 0 },
    Player2: { X: 750, Y: 200, Score: 0 },
  });

  const isLoading = !user;
  const cpuYRef = useRef(gameState.Player2.Y);

  const p1Name = user?.username || "Player1";
  const p2Info: Record<"pvp" | "cpu" | "octopus", { name: string; avatar: string; background :string }> = {
    pvp: { name: "Player2", avatar: `${apiBase}/static/avatars/slime.png`, background: `${frontBase}/backgrounds/dojo.jpg` },
    cpu: { name: "CPU", avatar: `${apiBase}/static/avatars/ai.png`, background: `${frontBase}/backgrounds/dennnou.jpg` },
    octopus: { name: "Octopus", avatar: `${apiBase}/static/avatars/octopus.png`, background: `${frontBase}/backgrounds/ocean.jpg` },
    };

    const { name: p2Name, avatar: p2Avatar, background: background } = p2Info[mode];
  // 🎨 描画関数
  const drawGame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, state: GameState) => {
    const { BallX: ballX, BallY: ballY, Player1: p1, Player2: p2, Winner: winner } = state;


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ボール
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    // パドル
    ctx.fillStyle = "blue";
    ctx.fillRect(p1.X - 5, p1.Y - 25, 10, 50);
    ctx.fillStyle = "red";
    ctx.fillRect(p2.X - 5, p2.Y - 25, 10, 50);

    // スコア
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    if (mode === "octopus") {
    ctx.save();
    ctx.globalAlpha = 0.2 * p1.Score; // 透過を弱くして何層も重ねる

    for (let i = 0; i < 200; i++) {
        const x = Math.random() * (canvas.width);
        const y = Math.random() * canvas.height;
        const r = Math.random() * 100; // 半径
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "rgba(0,0,0,0.8)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
    }

    // 勝者表示
    if (winner) {
    const message = `${winner === "Player1" ? p1Name : p2Name} Wins!`;
    ctx.font = "40px Arial";

    // メッセージの幅を測ってボックスサイズを調整
    const textMetrics = ctx.measureText(message);
    const textWidth = textMetrics.width;
    const textHeight = 50; // 高さは固定でもOK
    const boxPadding = 20;

    const boxX = canvas.width / 2 - textWidth / 2 - boxPadding;
    const boxY = canvas.height / 2 - textHeight / 2 - 10;
    const boxW = textWidth + boxPadding * 2;
    const boxH = textHeight;

    // 🔲 背景ボックスを先に描く
    ctx.fillStyle = "rgba(0, 0, 0, 1)"; // 半透明の黒
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // ✍️ その上にテキストを描く
    ctx.fillStyle = winner === "Player1" ? "blue" : "red";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    // 🔒 接続解除 & リダイレクト
    if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
    }
    setTimeout(() => router.push("/dashboard"), 1000);
    }};

  // 🎮 WebSocket接続（PvPもCPUも共通）
  useEffect(() => {
    console.log("user:", user);
    if (!mode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname || "localhost";
    const socketUrl = `${protocol}://${host}:${WS_PORT}/ws`;

    const socket = new WebSocket(socketUrl);
    socket.onopen = () => {
    console.log("WebSocket connected");
    wsRef.current = socket;
    };
    socket.onerror = (ev) => console.error("WebSocket error", ev);

    socket.onmessage = (event) => {
      try {
        const state: GameState = JSON.parse(event.data);
        setGameState(state);
        drawGame(ctx, canvas, state);
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      wsRef.current = null;
    };

    return () => {
    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
    }
    };
  }, [mode]);

  // ⌨️ キー操作（Player1のみ送信）
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      let player = "1";
      let action = "";
      const key = e.key.toLowerCase();

      if (key === "w") action = "up";
      if (key === "s") action = "down";
      
      if (mode === "pvp") {
        if (key === "i") { player = "2"; action = "up"; }
        if (key === "k")  { player = "2"; action = "down"; }
    }

      if (action) ws.send(JSON.stringify({ type: "move", player, action }));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode]);

        useEffect(() => {
        if (mode == "pvp") return;

        const directionRef = { current: Math.random() < 0.5 ? "up" : "down" as "up" | "down" };

        // 次に方向を切り替えるタイミングをランダムで決める
        let nextChange = Date.now() + 500 + Math.random() * 1000; // 0.5〜1.5秒後

        const interval = setInterval(() => {
            const ws = wsRef.current;
            if (!ws || ws.readyState !== WebSocket.OPEN) return;

            ws.send(JSON.stringify({ type: "move", player: "2", action: directionRef.current }));

            if (Date.now() >= nextChange) {
            // 方向を反転
            directionRef.current = directionRef.current === "up" ? "down" : "up";
            // 次の切り替えタイミングを更新
            nextChange = Date.now() + 500 + Math.random() * 1000;
            }
        }, 50);

        return () => clearInterval(interval);
        }, [mode]);

  return (
<div className="game-content max-w-2xl mx-auto p-4">
  <div className="container">
    <div className="player1">
      {p1Name}
      <span>Score: {gameState.Player1.Score}</span>
      <img src={`${apiBase + user?.avatar}`} />
    </div>
    <div className="player2">
      {p2Name}
      <span>Score: {gameState.Player2.Score}</span>
      <img src={`${p2Avatar}`}/>
    </div>
  </div>
    <canvas
    ref={canvasRef}
    width={800}
    height={400}
    className="border-2 border-white bg-cover bg-center opacity-70"
    style={{ backgroundImage: `url(${background})` }}
    />
    </div>
  );
}
