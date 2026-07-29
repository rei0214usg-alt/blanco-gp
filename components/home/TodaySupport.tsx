"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  collectionGroup,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type TodaySupportItem = {
  id: string;
  staffId: string;
  staffName: string;
  userName: string;
  createdAt: Date | null;
};

function getJapanDateKey() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year =
    parts.find((part) => part.type === "year")?.value ?? "";
  const month =
    parts.find((part) => part.type === "month")?.value ?? "";
  const day =
    parts.find((part) => part.type === "day")?.value ?? "";

  return `${year}-${month}-${day}`;
}

export default function TodaySupport() {
  const [supports, setSupports] = useState<TodaySupportItem[]>([]);
  const [staffNames, setStaffNames] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const dateKey = getJapanDateKey();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "racers"),
      (snapshot) => {
        const nextStaffNames: Record<string, string> = {};

        snapshot.docs.forEach((staffDoc) => {
          const data = staffDoc.data();

          nextStaffNames[staffDoc.id] =
            typeof data.name === "string"
              ? data.name
              : "名前未設定";
        });

        setStaffNames(nextStaffNames);
      },
      (error) => {
        console.error(
          "スタッフ情報の読み込みに失敗しました。",
          error,
        );
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const todaySupportQuery = query(
      collectionGroup(db, "daily"),
      where("dateKey", "==", dateKey),
    );

    const unsubscribe = onSnapshot(
      todaySupportQuery,
      (snapshot) => {
        const nextSupports = snapshot.docs
          .map((supportDoc) => {
            const data = supportDoc.data();

            return {
              id: supportDoc.id,
              staffId:
                typeof data.staffId === "string"
                  ? data.staffId
                  : "",
              staffName: "",
              userName:
                typeof data.userName === "string"
                  ? data.userName
                  : "名前未設定",
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate()
                : null,
            };
          })
          .sort((a, b) => {
            const aTime = a.createdAt?.getTime() ?? 0;
            const bTime = b.createdAt?.getTime() ?? 0;

            return bTime - aTime;
          })
          .slice(0, 5);

        setSupports(nextSupports);
        setIsLoading(false);
        setErrorMessage("");
      },
      (error) => {
        console.error(
          "今日の応援の読み込みに失敗しました。",
          error,
        );

        setErrorMessage(
          "今日の応援を読み込めませんでした。",
        );
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [dateKey]);

  const formatTime = (date: Date | null) => {
    if (!date) {
      return "送信中...";
    }

    return new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <section className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/30 via-neutral-900 to-neutral-950 p-6">
      <p className="text-xs font-black tracking-[0.25em] text-red-400">
        TODAY&apos;S SUPPORT
      </p>

      <div className="mt-2 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-black">
          今日の応援
        </h2>

        <p className="text-sm font-bold text-neutral-400">
          {supports.length}件
        </p>
      </div>

      {isLoading && (
        <p className="mt-5 text-sm text-neutral-400">
          読み込み中...
        </p>
      )}

      {errorMessage && (
        <p className="mt-5 text-sm font-bold text-red-400">
          {errorMessage}
        </p>
      )}

      {!isLoading &&
        !errorMessage &&
        supports.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-5 text-center">
            <p className="text-sm text-neutral-500">
              今日はまだ応援がありません。
            </p>

            <p className="mt-2 font-bold">
              最初の応援を届けよう！
            </p>
          </div>
        )}

      <div className="mt-5 space-y-3">
        {supports.map((support) => {
          const staffName =
            staffNames[support.staffId] ??
            "スタッフ";

          return (
            <Link
              key={support.id}
              href={`/staff/${support.staffId}`}
              className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-red-500/40 hover:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">
                    {support.userName}さんが
                  </p>

                  <p className="mt-1 text-neutral-300">
                    {staffName}さんを応援しました 👏
                  </p>
                </div>

                <p className="shrink-0 text-xs text-neutral-500">
                  {formatTime(support.createdAt)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}