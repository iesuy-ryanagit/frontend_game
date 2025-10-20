"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
const frontBase= process.env.FRONTEND_URL || "";

const p2Info: Record<
  "pvp" | "cpu" | "octopus",
  { name: string; avatar: string; background: string; description: string }
> = {
  pvp: {
    name: "ローカル対戦",
    avatar: `${apiBase}/static/avatars/slime.png`,
    background: `${frontBase}/backgrounds/dojo.jpg`,
    description: "ローカル上で2人で対戦。友達と一緒に楽しもう。",
  },
  cpu: {
    name: "CPU対戦",
    avatar: `${apiBase}/static/avatars/ai.png`,
    background: `${frontBase}/backgrounds/dennnou.jpg`,
    description: "コンピューター相手に腕試し。戦略を練って勝利を目指そう。",
  },
  octopus: {
    name: "Octopus対戦",
    avatar: `${apiBase}/static/avatars/octopus.png`,
    background: `${frontBase}/backgrounds/ocean.jpg`,
    description: "謎のオクトパスとの対戦。謎のギミックに挑戦しよう。",
  },
};

export default function GameModeSelectPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<"pvp" | "cpu" | "octopus" | null>(null);

  const handleSelect = (mode: "pvp" | "cpu" | "octopus") => {
    router.push(`/game/${mode}`);
  };

  return (
    <div className="page-content text-center text-white mt-10 relative">
      <h1 className="text-3xl mb-6 font-bold">ゲームモードを選択</h1>

      <div className="container">
        {(["pvp", "cpu", "octopus"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setSelectedMode(mode);
              handleSelect(mode);
            }}
            className={`player1`} // ここでplayer1/2のレイアウトを流用
          >
            <img
              src={p2Info[mode].avatar}
              alt={p2Info[mode].name}
            />
            <div className="text-left">
              <div className="font-bold">{p2Info[mode].name}</div>
              <div className="text-sm">{p2Info[mode].description}</div>
            </div>
          </button>
        ))}
      </div>
    <div className="controls mt-6 text-center">
    <h2 className="text-lg font-bold neon mb-2">操作方法</h2>
    <div className="flex justify-center gap-10 flex-wrap">
        <div>
        <div className="font-semibold mb-1">Player1（左）</div>
        <div>
            <span className="keycap">W</span>：上
            <span className="keycap">S</span>：下
        </div>
        </div>
        <div>
        <div className="font-semibold mb-1">Player2（右）(ローカル対戦のみ)</div>
        <div>
            <span className="keycap">I</span>：上
            <span className="keycap">K</span>：下
        </div>
        </div>
    </div>
    </div>
      {selectedMode && (
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20 -z-10 bg-center bg-cover rounded-xl"
          style={{ backgroundImage: `url(${p2Info[selectedMode].background})` }}
        />
      )}
    </div>
  );
}
