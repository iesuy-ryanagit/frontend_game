import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="page-content">
        <h1 className="text-4xl font-bold tracking-wider">Re_trascendence</h1>

        <div className="space-y-4">
          <Link href="/login" className="block">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded transition duration-300">
              ログイン
            </button>
          </Link>

          <Link href="/signup" className="block">
            <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded transition duration-300">
              サインアップ
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
