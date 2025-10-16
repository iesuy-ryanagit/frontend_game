"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GameComponent from "@/app/GameComponent";

export default function GamePageRoute() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return <p>Redirecting to login...</p>;

  return <GameComponent />;
}
