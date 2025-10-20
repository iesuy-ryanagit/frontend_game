"use client";

import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="page-content">
      <h1 className="text-2xl font-bold mb-4">サインアップ</h1>
      <SignupForm/>
      <h1 className="text-2xl font-bold mb-4">サインアップ済みの方はこちら</h1>
      <a href="/login" className="text-blue-600 hover:underline">ログインページへ</a>
    </div>
  );
}