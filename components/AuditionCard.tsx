const AUDITION_DATE = "2026-11-16";

function calculateRemainingDays(targetDate: string) {
  const today = new Date();
  const target = new Date(`${targetDate}T00:00:00+09:00`);

  const todayInJapan = new Date(
    today.toLocaleString("en-US", {
      timeZone: "Asia/Tokyo",
    })
  );

  todayInJapan.setHours(0, 0, 0, 0);

  const difference = target.getTime() - todayInJapan.getTime();
  const remainingDays = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  return remainingDays;
}

export default function AuditionCard() {
  const remainingDays = calculateRemainingDays(AUDITION_DATE);

  const formattedDate = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Tokyo",
  }).format(new Date(`${AUDITION_DATE}T00:00:00+09:00`));

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold tracking-[0.2em] text-red-600">
        🏁 NEXT AUDITION
      </p>

      <p className="mt-3 text-2xl font-bold text-black">
        {formattedDate}
      </p>

      <div className="mt-5 border-t border-gray-200 pt-5">
        <p className="text-sm text-gray-500">
          オーディションまで
        </p>

        <p className="mt-1 text-4xl font-black text-red-600">
          {remainingDays > 0
            ? `あと ${remainingDays}日`
            : remainingDays === 0
              ? "本日開催！"
              : "オーディション終了"}
        </p>
      </div>
    </div>
  );
}