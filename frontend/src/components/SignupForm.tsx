"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth"; // signup用API関数
import { useAuth } from "@/context/AuthContext";

export default function SignupForm() {
  const auth = useAuth();
  if (!auth) throw new Error("useAuth must be used within AuthProvider");
  const { login: contextLogin } = auth;
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signup(username, password); // signup API呼び出し
      // dataは { jwt, username } などのレスポンスを想定
      if (contextLogin) {
        contextLogin(data.jwt || data.token || data.access_token || data, data.username || data);
        router.push("/dashboard"); // サインアップ後はダッシュボードへ
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message);
    }
  }

  return (
    <div className="panel auth-panel">
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
