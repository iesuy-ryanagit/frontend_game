"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/lib/auth";

export const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";

export default function DashboardPage() {
  const [username, setUsername] = useState<string>("ゲスト");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // プロフィール取得中
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      await fetchProfile(setUsername, setAvatar);
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(apiBase + "/logout", {
        method: "POST",
        credentials: "include", // Cookie送信
      });
      setUsername("ゲスト"); // フロント側もリセット
      router.push("/"); // ホームへ遷移
    } catch (err) {
      console.error("logout error:", err);
    }
  };

    const handleGoAvatar = async () => {
    router.push("/avatar");
    };

    const handleGoGame = async () => {
    router.push("/game");
    };


  if (loading) {
    return <p>プロフィールを読み込み中...</p>;
  }

  return (
    <div className="page-content">
      <h1 className="text-2xl font-bold mb-4">ホーム画面</h1>
      <p>playerName:{username}</p>

      {avatar && (
        <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full mt-4" />
      )}

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleGoAvatar}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          アバター選択ページへ
        </button>
      </div>

      <button
        onClick={handleGoGame}
        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        ゲームを始める
      </button>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        ログアウト
      </button>
    </div>
  );
}
