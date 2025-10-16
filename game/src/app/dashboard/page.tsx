"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
      <p>ようこそ、{user?.username ?? "ゲスト"}さん</p>
    </div>
  );
}
