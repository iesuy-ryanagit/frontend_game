"use client";

import { useEffect, useState, useRef } from "react";

interface CardInstance {
  id: string;
  name: string;
  type: string;
  cost: number;
  hp: number;
  effect: string;
  tapped: boolean;
  current_hp: number;
}

interface Zone {
  deck: CardInstance[];
  hand: CardInstance[];
  battle: CardInstance[];
  mana: CardInstance[];
  graveyard: CardInstance[];
  shield: number;
}

interface Player {
  id: string;
  zone: Zone;
}

interface GameState {
  player: Player;
  enemy: Player;
  turn_player_id: string;
  turn_count: number;
  winner?: string;
}

interface WSMessage {
  type: string;
  data: any;
}

export default function Page() {
    const [gameState, setGameState] = useState<GameState>({
    player: {
        id: "player",
        zone: { deck: [], hand: [], battle: [], mana: [], graveyard: [], shield: 5 }
    },
    enemy: {
        id: "cpu",
        zone: { deck: [], hand: [], battle: [], mana: [], graveyard: [], shield: 5 }
    },
    turn_player_id: "player",
    turn_count: 1
    });

    const wsRef = useRef<WebSocket | null>(null);
    useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WS server");
    };

    ws.onmessage = (event) => {
      const msg: WSMessage = JSON.parse(event.data);
      if (msg.type === "UpdateState" || msg.type === "GameOver") {
        setGameState(msg.data);
      }
    };

    ws.onclose = () => {
      console.log("WS connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

const handleEndTurn = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "EndTurn" }));
    }
  };

  if (!gameState) return <div>Connecting...</div>;

  const { player, enemy, turn_player_id, turn_count, winner } = gameState;

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Turn {turn_count} - {turn_player_id}'s turn
      </h2>
      {winner && <h2 style={{ color: "red" }}>Winner: {winner}</h2>}

      <h3>Player</h3>
      <p>Shield: {player.zone.shield}</p>
      <p>Deck: {player.zone.deck.length} cards</p>

      <h3>Enemy</h3>
      <p>Shield: {enemy.zone.shield}</p>

      {turn_player_id === "player" && (
        <button
          onClick={handleEndTurn}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            backgroundColor: "lightblue",
            borderRadius: "8px",
          }}
        >
          End Turn
        </button>
      )}
    </div>
  );
}
