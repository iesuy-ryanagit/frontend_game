"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";



export const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";

interface Avatar {
  id: number;
  name: string;
  url: string;
}

export default function AvatarSelectPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const auth = useAuth();
  const router = useRouter();

  if (!auth) return <p>Loading...</p>; // null の場合の保険
  const { refreshUser } = auth;


  useEffect(() => {
    fetch(apiBase + "/avatar/list")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setAvatars(data))
      .catch((error) => {
        console.error("Failed to fetch avatars:", error);
        setMessage("アバターの取得に失敗しました");
      });
  }, []);

  const handleSelect = (id: number) => {
    setSelectedAvatar(id);
  };

  const handleSave = async () => {
    if (selectedAvatar === null) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(apiBase + "/avatar/select", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ avatar_id: selectedAvatar }),
      });

      if (res.ok) {
        await refreshUser();
        setMessage("アバターを更新しました！");
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "更新に失敗しました");
      }
    } catch (e) {
      console.error("Save error:", e);
      setMessage("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

    const handleGoDash = async () => {
    router.push("/dashboard");
    };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">アバターを選択</h1>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleSelect(avatar.id)}
            className={`relative rounded-xl overflow-hidden border-4 transition-all duration-200 ${
              selectedAvatar === avatar.id
                ? "border-blue-500 scale-105"
                : "border-transparent hover:scale-105"
            }`}
          >
            <Image
              src={`${apiBase}${avatar.url}`} 
              alt={avatar.name}
              width={120}
              height={120}
              className="object-cover"
              unoptimized 
            />
            {selectedAvatar === avatar.id && (
              <div className="absolute inset-0 bg-blue-500/40 flex items-center justify-center text-white font-bold">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={loading || selectedAvatar === null}
        className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "保存中..." : "保存する"}
      </button>
            <button
        onClick={handleGoDash}
        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        ゲームを始める
      </button>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
}
