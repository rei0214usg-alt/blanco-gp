"use client";
import Link from "next/link";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import TodaySupport from "@/components/home/TodaySupport";
import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
type Racer = {
  id: string;
  name: string;
  progress: number;
};
type LatestComment = {
  id: string;
  staffId: string;
  userName: string;
  message: string;
};
export default function HomePage() {
  const [racers, setRacers] = useState<Racer[]>([]);
const [latestComment, setLatestComment] =
  useState<LatestComment | null>(null);
  useEffect(() => {
  const commentsQuery = query(
    collection(db, "comments"),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const unsubscribe = onSnapshot(
    commentsQuery,
    (snapshot) => {
      if (snapshot.empty) {
        setLatestComment(null);
        return;
      }

      const document = snapshot.docs[0];
      const data = document.data();

      setLatestComment({
        id: document.id,
        staffId: String(data.staffId ?? ""),
        userName: String(data.userName ?? "匿名"),
        message: String(data.message ?? ""),
      });
    },
    (error) => {
      console.error("新着コメントの取得に失敗しました:", error);
    }
  );

  return () => unsubscribe();
}, []);
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "staffs"),
    (snapshot) => {
      const racerData = snapshot.docs.map((document) => {
        const data = document.data();

        return {
          id: document.id,
          name: String(data.name ?? ""),
          progress: Number(data.progress ?? 0),
        };
      });

      racerData.sort((a, b) => b.progress - a.progress);
      setRacers(racerData.slice(0, 3));
    },
    (error) => {
      console.error("ランキングの取得に失敗しました:", error);
    }
  );

  return () => unsubscribe();
}, []);
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-md">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-6 shadow-2xl">
          <p className="text-xs font-black tracking-[0.35em] text-red-500">
            BLANCO GP
          </p>

          <h1 className="mt-3 text-4xl font-black italic">
            HOME
          </h1>

          <p className="mt-3 leading-7 text-neutral-400">
            Challenge Together.
            <br />
            Grow Together.
          </p>

          <div className="mt-6">
            <GoogleLoginButton />
          </div>
        </header>

        <div className="mt-6 space-y-5">
          <TodaySupport />

          <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <p className="text-xs font-black tracking-[0.25em] text-red-400">
              NEW COMMENTS
            </p>

            <h2 className="mt-2 text-2xl font-black">
              新着コメント
            </h2>

            {latestComment ? (
  <Link
    href={`/staff/${latestComment.staffId}`}
    className="mt-5 block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/5"
  >
    <p className="text-sm font-bold">
      {latestComment.userName}さんから
    </p>

    <p className="mt-2 leading-7 text-neutral-300">
      {latestComment.message}
    </p>
  </Link>
) : (
  <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-4 text-sm text-neutral-500">
    まだコメントはありません
  </div>
)}
          </section>

          <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-black tracking-[0.25em] text-red-400">
                  LIVE RANKING
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  ランキング
                </h2>
              </div>

              <Link
                href="/race"
                className="text-sm font-bold text-neutral-400 transition hover:text-white"
              >
                すべて見る →
              </Link>
            </div>

            <div className="mt-5 space-y-3">
  {racers.map((racer, index) => (
    <Link
      key={racer.id}
      href={`/staff/${racer.id}`}
      className={`flex items-center justify-between rounded-2xl border p-4 transition hover:bg-white/5 ${
        index === 0
          ? "border-yellow-400/30 bg-yellow-400/5"
          : "border-white/10 bg-black/20"
      }`}
    >
      <p className="font-black">
        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {racer.name}
      </p>

      <p className="font-black">
        {racer.progress} / 100
      </p>
    </Link>
  ))}
</div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <p className="text-xs font-black tracking-[0.25em] text-red-400">
              NEXT AUDITION
            </p>

            <h2 className="mt-2 text-2xl font-black">
              次回デビュー試験
            </h2>

            <p className="mt-5 text-3xl font-black">
              2026.11.16
            </p>
          </section>

          <nav className="grid grid-cols-2 gap-3">
            <Link
              href="/race"
              className="rounded-2xl bg-white px-5 py-4 text-center font-black text-black transition hover:bg-neutral-200"
            >
              🏎 レースを見る
            </Link>

            <Link
              href="/admin"
              className="rounded-2xl border border-white/10 px-5 py-4 text-center font-black transition hover:bg-white/5"
            >
              ⚙️ 管理画面
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}