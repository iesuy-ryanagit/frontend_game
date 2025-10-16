import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ホーム</h1>
      <ul className="list-disc pl-6">
        <li>
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </li>
        <li>
          <Link href="/game" className="text-blue-600 hover:underline">
            ゲーム
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ダッシュボード
          </Link>
        </li>
      </ul>
    </div>
  );
}
