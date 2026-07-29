"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type User,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type SupportButtonProps = {
  staffId: string;
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

export default function SupportButton({
  staffId,
}: SupportButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [supportCount, setSupportCount] = useState(0);
  const [hasSupportedToday, setHasSupportedToday] =
    useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dateKey = getJapanDateKey();

  // ログイン状態を確認
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsAuthLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  // 累計応援数をリアルタイムで取得
  useEffect(() => {
    const supportRef = doc(db, "supports", staffId);

    const unsubscribe = onSnapshot(
      supportRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setSupportCount(0);
          return;
        }

        const data = snapshot.data();

        setSupportCount(
          typeof data.count === "number"
            ? data.count
            : 0,
        );
      },
      (error) => {
        console.error(
          "応援数の読み込みに失敗しました。",
          error,
        );
        setErrorMessage(
          "応援数を読み込めませんでした。",
        );
      },
    );

    return unsubscribe;
  }, [staffId]);

  // 今日すでに応援しているか確認
  useEffect(() => {
    if (!user) {
      setHasSupportedToday(false);
      return;
    }

    const dailySupportId = `${user.uid}_${dateKey}`;

    const dailySupportRef = doc(
      db,
      "supports",
      staffId,
      "daily",
      dailySupportId,
    );

    const unsubscribe = onSnapshot(
      dailySupportRef,
      (snapshot) => {
        setHasSupportedToday(snapshot.exists());
      },
      (error) => {
        console.error(
          "今日の応援状態を確認できませんでした。",
          error,
        );
      },
    );

    return unsubscribe;
  }, [user, staffId, dateKey]);

  const handleSupport = async () => {
    if (!user || hasSupportedToday || isUpdating) {
      return;
    }

    setIsUpdating(true);
    setErrorMessage("");

    try {
      const supportRef = doc(
        db,
        "supports",
        staffId,
      );

      const dailySupportId = `${user.uid}_${dateKey}`;

      const dailySupportRef = doc(
        db,
        "supports",
        staffId,
        "daily",
        dailySupportId,
      );

      await runTransaction(
        db,
        async (transaction) => {
          const dailySnapshot =
            await transaction.get(dailySupportRef);

          // 同じ日にすでに応援済みなら追加しない
          if (dailySnapshot.exists()) {
            throw new Error("ALREADY_SUPPORTED_TODAY");
          }

          const supportSnapshot =
            await transaction.get(supportRef);

          const currentCount =
            supportSnapshot.exists() &&
            typeof supportSnapshot.data().count ===
              "number"
              ? supportSnapshot.data().count
              : 0;

          transaction.set(
            supportRef,
            {
              count: currentCount + 1,
              staffId,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          );

          transaction.set(dailySupportRef, {
            staffId,
            userId: user.uid,
            userName:
              user.displayName ??
              user.email ??
              "名前未設定",
            userEmail: user.email ?? "",
            dateKey,
            createdAt: serverTimestamp(),
          });
        },
      );

      setHasSupportedToday(true);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "ALREADY_SUPPORTED_TODAY"
      ) {
        setHasSupportedToday(true);
        return;
      }

      console.error(
        "応援の送信に失敗しました。",
        error,
      );

      setErrorMessage(
        "応援を送信できませんでした。",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isAuthLoading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-neutral-950 p-6 text-center">
        <p className="text-sm text-neutral-400">
          ログイン状態を確認しています...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/30 via-neutral-950 to-neutral-950 p-6 text-center">
      <p className="text-xs font-black tracking-[0.25em] text-red-400">
        SUPPORT
      </p>

      <p className="mt-3 text-lg font-bold text-white">
        <span className="mr-2 text-3xl font-black">
          {supportCount}
        </span>
        人が応援しています
      </p>

      {!user ? (
        <div className="mt-5">
          <p className="mb-4 text-sm text-neutral-400">
            応援するにはログインが必要です
          </p>

          <Link
            href="/login"
            className="block w-full rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:bg-neutral-200"
          >
            Googleでログイン
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-2 text-xs text-neutral-500">
            {user.displayName ?? user.email}
            さんとしてログイン中
          </p>

          <button
            type="button"
            onClick={handleSupport}
            disabled={
              hasSupportedToday ||
              isUpdating
            }
            className={`mt-5 w-full rounded-2xl px-5 py-4 font-black transition ${
              hasSupportedToday
                ? "cursor-default border border-white/10 bg-white/5 text-neutral-400"
                : "bg-white text-black hover:-translate-y-0.5 hover:bg-red-100"
            }`}
          >
            {isUpdating
              ? "応援を送っています..."
              : hasSupportedToday
                ? "👏 本日は応援済み"
                : "👏 今日の応援を送る"}
          </button>

          {hasSupportedToday && (
            <p className="mt-3 text-xs text-neutral-500">
              明日になると、また応援できます
            </p>
          )}
        </>
      )}

      {errorMessage && (
        <p className="mt-3 text-sm font-bold text-red-400">
          {errorMessage}
        </p>
      )}
    </section>
  );
}