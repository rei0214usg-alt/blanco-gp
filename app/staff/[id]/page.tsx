import SupportComments from "@/components/staff/SupportComments";
import SupportButton from "@/components/staff/SupportButton";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChallengeTimeline from "@/components/staff/ChallengeTimeline";
import Link from "next/link";
import type { Staff } from "@/types/staff";

type StaffPageProps = {
  params: Promise<{
    id: string;
  }>;
};



const statusLabels = {
  MODEL_CHALLENGE: "MODEL CHALLENGE",
  MODEL_COMPLETE: "MODEL COMPLETE",
  AUDITION: "AUDITION",
  STYLIST: "STYLIST DEBUT",
};

export default async function StaffPage({ params }: StaffPageProps) {
  const { id } = await params;

  // 今回は画面の土台を確認するため、仮データを表示します。
  // 次の工程でFirestoreのスタッフ情報につなげます。
 const docRef = doc(db, "staffs", id);
const docSnap = await getDoc(docRef);

if (!docSnap.exists()) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-5 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-black">スタッフが見つかりません</h1>

        <Link
          href="/race"
          className="mt-6 inline-block rounded-xl bg-red-600 px-5 py-3 font-bold"
        >
          レース画面へ戻る
        </Link>
      </div>
    </main>
  );
}

const data = docSnap.data();

const staff: Staff = {
  id: docSnap.id,
  name: String(data.name ?? ""),
  progress: Number(data.progress ?? 0),
  status: String(data.status ?? "MODEL_CHALLENGE") as Staff["status"],
  challengeStatement: String(data.challengeStatement ?? ""),
  auditionDate: String(data.auditionDate ?? ""),
  car: String(data.car ?? "🚗"),
  photoURL: String(data.photoURL ?? ""),
};

  const remaining = Math.max(100 - staff.progress, 0);
  const progressPercent = Math.min(
    Math.max(staff.progress, 0),
    100,
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-md">
        <Link
          href="/race"
          className="inline-flex items-center gap-2 text-sm text-neutral-300 transition hover:text-white"
        >
          <span aria-hidden="true">←</span>
          レースに戻る
        </Link>

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl">
          <div className="border-b border-white/10 px-6 py-8 text-center">
            <div className="mb-6 flex justify-center">
  {staff.photoURL ? (
    <img
      src={staff.photoURL}
      alt={staff.name}
      className="h-32 w-32 rounded-full object-cover border-4 border-white"
    />
  ) : (
    <div
      className="flex h-32 w-32 items-center justify-center rounded-full bg-neutral-700 text-5xl"
      role="img"
      aria-label="レーシングカー"
    >
      {staff.car}
    </div>
  )}
</div>

            <p className="text-xs font-bold tracking-[0.3em] text-neutral-400">
              BLANCO GP
            </p>

            <h1 className="mt-3 text-3xl font-black">
              {staff.name}
            </h1>

            <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-wider">
              {statusLabels[staff.status]}
            </div>
          </div>

          <div className="space-y-6 px-6 py-7">
            <section>
              <p className="text-xs font-bold tracking-[0.2em] text-neutral-400">
                挑戦宣言
              </p>

              <blockquote className="mt-3 border-l-2 border-white pl-4 text-base font-medium leading-8">
                「{staff.challengeStatement}」
              </blockquote>
            </section>

            <section className="rounded-2xl bg-white/5 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-neutral-400">
                    MODEL PROGRESS
                  </p>

                  <p className="mt-2 text-4xl font-black">
                    {staff.progress}
                    <span className="ml-1 text-lg text-neutral-400">
                      / 100
                    </span>
                  </p>
                </div>

                <p className="text-right text-sm font-bold">
                  {remaining === 0
                    ? "100人達成！"
                    : `あと${remaining}人`}
                </p>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-neutral-700">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </section>
<ChallengeTimeline
  progress={staff.progress}
  auditionDate={staff.auditionDate}
/>

<section className="rounded-2xl border border-white/10 p-4">
  <p className="text-xs text-neutral-400">
    次回デビュー試験
  </p>

  <p className="mt-2 font-bold">
    {staff.auditionDate ?? "未定"}
  </p>
</section>

<SupportButton staffId={staff.id} />
<SupportComments staffId={staff.id} />
          </div>
        </section>
      </div>
    </main>
  );
}