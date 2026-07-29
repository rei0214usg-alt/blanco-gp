type ChallengeTimelineProps = {
  progress: number;
  auditionDate?: string | null;
};

export default function ChallengeTimeline({
  progress,
  auditionDate,
}: ChallengeTimelineProps) {
  const isModelComplete = progress >= 100;

  const steps = [
    {
      title: "100 MODEL CHALLENGE",
      description: isModelComplete ? "100人モデル達成" : `あと${100 - progress}人`,
      active: true,
      completed: isModelComplete,
    },
    {
      title: "MODEL COMPLETE",
      description: isModelComplete ? "達成済み" : "100人達成後に進みます",
      active: isModelComplete,
      completed: false,
    },
    {
      title: "AUDITION",
      description: auditionDate ?? "日程未定",
      active: isModelComplete,
      completed: false,
    },
    {
      title: "STYLIST DEBUT",
      description: "オーディション合格後",
      active: false,
      completed: false,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8">
      <div className="mb-8">
        <p className="text-xs font-black tracking-[0.3em] text-red-500">
          CHALLENGE TIMELINE
        </p>

        <h2 className="mt-2 text-2xl font-black italic text-white">
          デビューまでの道のり
        </h2>
      </div>

      <div className="space-y-0">
        {steps.map((step, index) => (
          <div key={step.title} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-black ${
                  step.completed
                    ? "border-yellow-400 bg-yellow-400 text-black"
                    : step.active
                      ? "border-red-500 bg-red-500/20 text-red-400"
                      : "border-white/15 bg-zinc-900 text-zinc-600"
                }`}
              >
                {step.completed ? "✓" : index + 1}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`h-16 w-px ${
                    step.completed ? "bg-yellow-400" : "bg-white/10"
                  }`}
                />
              )}
            </div>

            <div className="pb-8 pt-1">
              <p
                className={`text-sm font-black tracking-wider ${
                  step.active || step.completed
                    ? "text-white"
                    : "text-zinc-600"
                }`}
              >
                {step.title}
              </p>

              <p
                className={`mt-1 text-sm ${
                  step.active || step.completed
                    ? "text-zinc-400"
                    : "text-zinc-700"
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}