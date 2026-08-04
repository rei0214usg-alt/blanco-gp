"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/race"
          className="text-xl font-black tracking-widest text-white"
        >
          🏁 BLANCO GP
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            🏠 ホーム
          </Link>

          <Link
            href="/race"
            className="rounded-xl px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            🏎 レース
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            🚪 ログアウト
          </button>
        </nav>
      </div>
    </header>
  );
}