import Link from "next/link";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import TodaySupport from "@/components/home/TodaySupport";
export default function HomePage() {
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

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-bold">
                大坂龍平さんへ
              </p>

              <p className="mt-2 leading-7 text-neutral-300">
                デビュー応援しています🔥
              </p>
            </div>
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
              <div className="flex items-center justify-between rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-4">
                <p className="font-black">
                  🥇 大坂龍平
                </p>

                <p className="font-black">
                  84 / 100
                </p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-black">
                  🥈 田中
                </p>

                <p className="font-black">
                  71 / 100
                </p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-black">
                  🥉 佐藤
                </p>

                <p className="font-black">
                  63 / 100
                </p>
              </div>
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