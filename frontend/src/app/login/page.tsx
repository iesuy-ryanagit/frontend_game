"use client";

import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="page-content">
        <h1 className="text-3xl font-bold text-center w-full">ログイン</h1>
        <LoginForm />
      <h1 className="text-2xl font-bold mb-4">サインアップがまだの方はこちら</h1>
      <a href="/signup" className="text-blue-600 hover:underline">サインアップページへ</a>
    </div>
  );
}
