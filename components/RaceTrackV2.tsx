import Link from "next/link";

type Racer = {
  id: string;
  name: string;
  progress: number;
  car: string;
  photoURL: string;
};

type RaceTrackV2Props = {
  racers: Racer[];
};

function getRank(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}`;
}

function getStage(progress: number) {
  if (progress >= 100) return "GOAL";
  if (progress >= 90) return "FINAL LAP";
  if (progress >= 60) return "CHARGE";
  if (progress >= 30) return "MIDDLE STAGE";
  return "START";
}

export default function RaceTrackV2({
  racers,
}: RaceTrackV2Props) {
  const sortedRacers = [...racers].sort(
    (a, b) => b.progress - a.progress
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-black shadow-2xl">
        <header className="flex flex-col gap-4 border-b border-zinc-800 bg-zinc-950 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.35em] text-red-500">
              BLANCO GRAND PRIX
            </p>

            <h2 className="mt-1 text-3xl font-black italic text-white">
              100 MODEL RACE
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

            <span className="text-xs font-black tracking-widest text-red-400">
              LIVE
            </span>
          </div>
        </header>

        <div>
          {sortedRacers.map((racer, index) => {
            const progress = Math.min(
              100,
              Math.max(0, racer.progress)
            );

            const remaining = Math.max(0, 100 - progress);
            const stage = getStage(progress);
            const isLeader = index === 0;
            const isFinalLap =
              progress >= 90 && progress < 100;
            const isGoal = progress >= 100;

            return (
  <Link
    key={racer.id}
    href={`/staff/${racer.id}`}
    className="block"
  >
    <article
              
                className={`relative border-b border-zinc-800 px-5 py-5 last:border-b-0 ${
                  isLeader
                    ? "bg-gradient-to-r from-yellow-400/10 via-black to-black"
                    : "bg-black"
                }`}
              >
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-neutral-800">
 {racer.photoURL ? (
  <img
    src={racer.photoURL}
    alt={racer.name}
    className="h-full w-full object-contain"
  />
) : (
  <div className="flex h-full w-full items-center justify-center text-3xl">
    🚗
  </div>
)}
</div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-xl font-black italic text-white sm:text-2xl">
                          {racer.name}
                        </h3>

                        {isLeader && (
                          <span className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-2 py-1 text-[10px] font-black tracking-widest text-yellow-300">
                            LEADER
                          </span>
                        )}

                        <span
                          className={`rounded-full border px-2 py-1 text-[10px] font-black tracking-widest ${
                            isGoal
                              ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300"
                              : isFinalLap
                                ? "animate-pulse border-red-500/60 bg-red-500/15 text-red-300"
                                : "border-white/20 bg-white/5 text-zinc-300"
                          }`}
                        >
                          {stage}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-bold tracking-[0.2em] text-zinc-600">
                        RACER {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 sm:block sm:text-right">
                    <p className="text-2xl font-black italic text-white sm:text-3xl">
                      {progress}
                      <span className="ml-1 text-base text-zinc-500">
                        /100
                      </span>
                    </p>

                    <p
                      className={`text-xs font-black tracking-widest ${
                        isGoal
                          ? "text-yellow-300"
                          : isFinalLap
                            ? "text-red-400"
                            : "text-zinc-500"
                      }`}
                    >
                      {isGoal
                        ? "100 MODEL COMPLETE"
                        : `あと${remaining}人`}
                    </p>
                  </div>
                </div>

                <div
                  className={`relative h-24 overflow-hidden rounded-2xl border-y-4 shadow-inner sm:h-28 ${
                    isGoal
                      ? "border-yellow-400/60 bg-gradient-to-b from-yellow-950 via-zinc-900 to-black"
                      : isFinalLap
                        ? "border-red-500/60 bg-gradient-to-b from-red-950 via-zinc-900 to-black"
                        : "border-white/20 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900"
                  }`}
                >
                  <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(90deg,transparent_0,transparent_44px,rgba(255,255,255,0.08)_44px,rgba(255,255,255,0.08)_46px)]" />

                  <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.8)_0,rgba(255,255,255,0.8)_24px,transparent_24px,transparent_48px)] opacity-50" />

                  <div className="absolute inset-y-0 left-0 w-3 bg-[repeating-linear-gradient(180deg,#ef4444_0,#ef4444_12px,#ffffff_12px,#ffffff_24px)]" />

                  <div className="absolute inset-y-0 right-0 w-12 border-l border-white/30 bg-[conic-gradient(#ffffff_25%,#111111_0_50%,#ffffff_0_75%,#111111_0)] bg-[length:20px_20px]" />

                  <div className="absolute right-1 top-2 rounded bg-black/90 px-2 py-1 text-[9px] font-black tracking-widest text-white">
                    GOAL
                  </div>

                  {isFinalLap && (
                    <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2 rounded-full border border-red-500/70 bg-black/80 px-4 py-1 text-[10px] font-black tracking-[0.25em] text-red-400 shadow-[0_0_18px_rgba(239,68,68,0.5)]">
                      FINAL LAP
                    </div>
                  )}

                  {isGoal && (
                    <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2 rounded-full border border-yellow-400/70 bg-black/80 px-4 py-1 text-[10px] font-black tracking-[0.25em] text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.5)]">
                      🏆 DEBUT
                    </div>
                  )}

                  <div
                    className="absolute bottom-3 z-20 transition-all duration-1000 ease-out sm:bottom-4"
                    style={{
                      left: `${progress}%`,
                      transform: `translateX(-${progress}%)`,
                    }}
                  >
                    <div className="relative">
                      {progress > 0 && progress < 100 && (
                        <div className="absolute right-full top-1/2 mr-1 h-2 w-16 -translate-y-1/2 rounded-full bg-white/20 blur-sm" />
                      )}

                      <div
  className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-black shadow-xl sm:h-16 sm:w-16"
  style={{
    transform: `rotate(${progress > 95 ? "-8deg" : "-3deg"})`,
  }}
>
  {racer.photoURL ? (
    <img
      src={racer.photoURL}
      alt={`${racer.name}のレーサー`}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-4xl">
      {racer.car}
    </div>
  )}

  
</div>
                    </div>
                  </div>

                  <div
                    className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-out ${
                      isGoal
                        ? "bg-gradient-to-r from-yellow-900 via-yellow-400 to-white"
                        : isFinalLap
                          ? "bg-gradient-to-r from-red-950 via-red-500 to-orange-300"
                          : "bg-gradient-to-r from-red-900 via-red-500 to-red-300"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </article>
</Link>
            );
          })}
        </div>

        {sortedRacers.length === 0 && (
          <div className="p-10 text-center text-zinc-400">
            レーサーのデータがありません。
          </div>
        )}
      </div>
    </section>
  );
}