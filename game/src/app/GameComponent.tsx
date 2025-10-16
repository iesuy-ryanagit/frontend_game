"use client";

import { useState } from "react";

const BOARD_SIZE = 8;

type Cell = "empty" | "black" | "white";

export default function OthelloGame() {
  // 初期盤面
  const initialBoard: Cell[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => "empty")
  );
  initialBoard[3][3] = "white";
  initialBoard[3][4] = "black";
  initialBoard[4][3] = "black";
  initialBoard[4][4] = "white";

  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState<"black" | "white">("black");

  // 簡易判定：隣接セルに相手の色があればひっくり返す（完全ルールではない）
  const handleClick = (row: number, col: number) => {
    if (board[row][col] !== "empty") return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = turn;

    // 右方向だけ反転（簡易版）
    if (col < BOARD_SIZE - 1 && board[row][col + 1] !== turn && board[row][col + 1] !== "empty") {
      newBoard[row][col + 1] = turn;
    }

    setBoard(newBoard);
    setTurn(turn === "black" ? "white" : "black");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">簡易オセロゲーム</h1>
      <p className="mb-2">現在のターン: {turn}</p>
      <div className="grid grid-cols-8 gap-0.5 border border-gray-600 w-[320px]">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="w-10 h-10 flex items-center justify-center border border-gray-400 cursor-pointer bg-green-600"
              onClick={() => handleClick(rIdx, cIdx)}
            >
              {cell !== "empty" && (
                <div
                  className={`w-8 h-8 rounded-full ${
                    cell === "black" ? "bg-black" : "bg-white"
                  }`}
                ></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
