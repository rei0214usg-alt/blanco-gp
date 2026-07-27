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

          return (
            <article
              key={racer.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-5 shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-red-500/50 sm:p-7"
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
                    <p className="text-4xl drop-shadow-lg sm:text-5xl">
                      {racer.car}
                    </p>
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

                  <div className="relative h-5 overflow-hidden rounded-full border border-white/10 bg-zinc-800 shadow-inner">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-800 via-red-600 to-red-400 shadow-[0_0_18px_rgba(239,68,68,0.65)] transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />

                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-b from-white/30 to-transparent transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />

                    <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(135deg,transparent,transparent_8px,white_8px,white_10px)]" />
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