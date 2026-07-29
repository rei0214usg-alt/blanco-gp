import Link from "next/link";
type Racer = {
  id: string;
  name: string;
  progress: number;
  car: string;
};

type RaceTrackProps = {
  racers: Racer[];
};

function getRankDisplay(index: number) {
  if (index === 0) {
    return {
      medal: "🥇",
      label: "1ST",
      rankStyle:
        "border-yellow-400 bg-yellow-400 text-black shadow-[0_0_24px_rgba(250,204,21,0.45)]",
    };
  }

  if (index === 1) {
    return {
      medal: "🥈",
      label: "2ND",
      rankStyle:
        "border-gray-300 bg-gray-300 text-black shadow-[0_0_20px_rgba(209,213,219,0.3)]",
    };
  }

  if (index === 2) {
    return {
      medal: "🥉",
      label: "3RD",
      rankStyle:
        "border-orange-700 bg-orange-700 text-white shadow-[0_0_20px_rgba(194,65,12,0.3)]",
    };
  }

  return {
    medal: "🏁",
    label: `${index + 1}TH`,
    rankStyle: "border-white/20 bg-white/10 text-white",
  };
}
function getRaceStage(progress: number) {
  if (progress >= 100) {
    return {
      label: "GOAL",
      textStyle: "text-yellow-300",
      badgeStyle:
        "border-yellow-400/50 bg-yellow-400/10 text-yellow-300",
    };
  }

  if (progress >= 90) {
    return {
      label: "FINAL LAP",
      textStyle: "text-red-400",
      badgeStyle:
        "animate-pulse border-red-500/60 bg-red-500/15 text-red-300",
    };
  }

  if (progress >= 60) {
    return {
      label: "CHARGE",
      textStyle: "text-orange-400",
      badgeStyle:
        "border-orange-500/40 bg-orange-500/10 text-orange-300",
    };
  }

  if (progress >= 30) {
    return {
      label: "MIDDLE STAGE",
      textStyle: "text-blue-400",
      badgeStyle:
        "border-blue-500/40 bg-blue-500/10 text-blue-300",
    };
  }

  return {
    label: "START",
    textStyle: "text-zinc-400",
    badgeStyle:
      "border-white/20 bg-white/5 text-zinc-300",
  };
}
export default function RaceTrack({ racers }: RaceTrackProps) {
  const sortedRacers = [...racers].sort(
    (a, b) => b.progress - a.progress
  );

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black tracking-[0.35em] text-red-500">
            LIVE RANKING
          </p>

          <h2 className="mt-2 text-3xl font-black italic text-white sm:text-4xl">
            MODEL RACE
          </h2>
        </div>

        <div className="rounded-full border border-red-500/50 bg-red-500/10 px-4 py-2">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-xs font-black tracking-widest text-red-400">
            LIVE
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {sortedRacers.map((racer, index) => {
          const progress = Math.min(
            100,
            Math.max(0, racer.progress)
          );

          const remaining = Math.max(0, 100 - progress);
          const rank = getRankDisplay(index);
          const isCompleted = progress >= 100;
          const isLeader = index === 0;

          return (
  <Link
    key={racer.id}
    href={`/staff/${racer.id}`}
    aria-label={`${racer.name}のスタッフ詳細を見る`}
    className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
  >
    <article
      className={`group relative cursor-pointer overflow-hidden rounded-3xl border bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-5 transition duration-300 hover:-translate-y-1 sm:p-7 ${
        isLeader
          ? "border-yellow-400/70 shadow-[0_0_45px_rgba(250,204,21,0.22)]"
          : "border-white/10 shadow-2xl hover:border-red-500/50"
      }`}
    >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl" />

              <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border font-black ${rank.rankStyle}`}
                    >
                      <span className="text-xl">{rank.medal}</span>
                      <span className="mt-0.5 text-[10px] tracking-wider">
                        {rank.label}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold tracking-[0.25em] text-zinc-500">
                        RACER {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="mt-1 truncate text-2xl font-black italic text-white sm:text-3xl">
                        {racer.name}
                      </h3>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                   
                  </div>
                </div>

                <div className="mt-7">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <span className="text-4xl font-black italic text-white sm:text-5xl">
                        {progress}
                      </span>

                      <span className="ml-1 text-lg font-black text-zinc-500">
                        /100
                      </span>

                      <span className="ml-2 text-xs font-bold tracking-widest text-zinc-500">
                        MODEL
                      </span>
                    </div>

                    <p className="text-2xl font-black italic text-red-500 sm:text-3xl">
                      {progress}%
                    </p>
                  </div>

                  <div className="relative h-32 overflow-hidden rounded-2xl border-y-4 border-white/20 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-inner sm:h-32">
  {/* アスファルトの模様 */}
  <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(90deg,transparent_0,transparent_44px,rgba(255,255,255,0.08)_44px,rgba(255,255,255,0.08)_46px)]" />

  {/* 中央の白線 */}
  <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.8)_0,rgba(255,255,255,0.8)_24px,transparent_24px,transparent_48px)] opacity-60" />

  {/* スタートライン */}
  <div className="absolute inset-y-0 left-0 w-3 bg-[repeating-linear-gradient(180deg,#ef4444_0,#ef4444_12px,#ffffff_12px,#ffffff_24px)]" />

  {/* ゴールライン */}
  <div className="absolute inset-y-0 right-0 w-12 border-l border-white/30 bg-[conic-gradient(#ffffff_25%,#111111_0_50%,#ffffff_0_75%,#111111_0)] bg-[length:20px_20px]" />

  <div className="absolute right-1 top-2 rounded bg-black/90 px-2 py-1 text-[9px] font-black tracking-widest text-white">
    GOAL
  </div>

  {/* 車 */}
  <div
    className="absolute bottom-5 z-20 transition-all duration-1000 ease-out sm:bottom-6"
    style={{
      left: `${progress}%`,
      transform: `translateX(-${progress}%)`,
    }}
  >
    <div className="relative">
      {/* 車の後ろのスピード線 */}
      {progress > 0 && progress < 100 && (
        <div className="absolute right-full top-1/2 mr-1 h-2 w-12 -translate-y-1/2 rounded-full bg-white/20 blur-sm sm:w-20" />
      )}

      {/* 絵文字を右向きに反転 */}
      <div
        className="text-6xl drop-shadow-[0_12px_10px_rgba(0,0,0,0.85)] sm:text-7xl"
        style={{ transform: "scaleX(-1)" }}
      >
        {racer.car}
      </div>
    </div>
  </div>

  {/* 下部の赤い進捗ライン */}
  <div
    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-300 shadow-[0_0_14px_rgba(239,68,68,0.7)] transition-all duration-1000 ease-out"
    style={{ width: `${progress}%` }}
  />
</div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    {isCompleted ? (
                      <div className="rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-2">
                        <p className="text-sm font-black tracking-wider text-yellow-300">
                          🏆 100 MODEL COMPLETE
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2">
                        <p className="text-sm font-black text-red-400">
                          🔥 GOALまであと
                          <span className="mx-1 text-xl text-white">
                            {remaining}
                          </span>
                          人
                        </p>
                      </div>
                    )}

                                        <p className="text-xs font-bold tracking-[0.2em] text-zinc-600">
                      BLANCO GRAND PRIX
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
      </div>

      {sortedRacers.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-10 text-center">
          <p className="text-lg font-bold text-zinc-400">
            レーサーのデータがありません。
          </p>
        </div>
      )}
    </section>
  );
}