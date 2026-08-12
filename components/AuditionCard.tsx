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

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Tokyo",
  }).format(new Date(`${date}T00:00:00+09:00`));
}

function RemainingDays({ date }: { date: string }) {
  const remainingDays = calculateRemainingDays(date);

  return (
    <p className="mt-2 text-3xl font-black text-red-600">
      {remainingDays > 0
        ? `あと ${remainingDays}日`
        : remainingDays === 0
          ? "本日開催！"
          : "終了"}
    </p>
  );
}

type AuditionCardProps = {
  tokaiDate: string;
  tokyoDate: string;
};

export default function AuditionCard({
  tokaiDate,
  tokyoDate,
}: AuditionCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold tracking-[0.2em] text-red-600">
        🏁 NEXT AUDITION
      </p>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* 東海 */}
        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-sm font-black tracking-widest text-gray-500">
            TOKAI
          </p>

          <p className="mt-1 text-xl font-black text-black">
            東海
          </p>

          <p className="mt-4 text-2xl font-bold text-black">
            {formatDate(tokaiDate)}
          </p>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">
              オーディションまで
            </p>

            <RemainingDays date={tokaiDate} />
          </div>
        </div>

        {/* 東京 */}
        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-sm font-black tracking-widest text-gray-500">
            TOKYO
          </p>

          <p className="mt-1 text-xl font-black text-black">
            東京
          </p>

          <p className="mt-4 text-2xl font-bold text-black">
            {formatDate(tokyoDate)}
          </p>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">
              オーディションまで
            </p>

            <RemainingDays date={tokyoDate} />
          </div>
        </div>

      </div>
    </div>
  );
}