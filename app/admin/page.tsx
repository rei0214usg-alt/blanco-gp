"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";

type Racer = {
  id: string;
  name: string;
  progress: number;
  car: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [racers, setRacers] = useState<Racer[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let unsubscribeRacers: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsCheckingAuth(false);
        router.replace("/admin/login");
        return;
      }

      setIsCheckingAuth(false);

      const racersCollection = collection(db, "racers");

      unsubscribeRacers = onSnapshot(
        racersCollection,
        (snapshot) => {
          const racerData = snapshot.docs.map((racerDocument) => {
            const data = racerDocument.data();

            return {
              id: racerDocument.id,
              name: String(data.name ?? ""),
              progress: Number(data.progress ?? 0),
              car: String(data.car ?? "🚗"),
            };
          });

          racerData.sort((a, b) => b.progress - a.progress);

          setRacers(racerData);
          setIsLoading(false);
          setErrorMessage("");
        },
        (error) => {
          console.error("Firestoreの読み込みに失敗しました:", error);
          setErrorMessage("データを読み込めませんでした。");
          setIsLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeRacers) {
        unsubscribeRacers();
      }
    };
  }, [router]);

  async function changeProgress(racer: Racer, amount: number) {
    if (amount < 0 && racer.progress <= 0) {
      return;
    }

    if (amount > 0 && racer.progress >= 100) {
      return;
    }

    try {
      setUpdatingId(racer.id);
      setErrorMessage("");

      const racerReference = doc(db, "racers", racer.id);

      await updateDoc(racerReference, {
        progress: increment(amount),
      });
    } catch (error) {
      console.error("モデル数の更新に失敗しました:", error);
      setErrorMessage("モデル数を更新できませんでした。");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      setErrorMessage("");

      await signOut(auth);
      router.replace("/admin/login");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
      setErrorMessage("ログアウトできませんでした。");
      setIsLoggingOut(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="font-bold text-gray-500">
          ログイン状態を確認中...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-red-600">
              BLANCO GP
            </p>

            <h1 className="mt-2 text-3xl font-black text-black">
              管理画面
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              モデル施術が終わったら、＋1を押してください。
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="shrink-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm disabled:opacity-50"
          >
            {isLoggingOut ? "ログアウト中..." : "ログアウト"}
          </button>
        </div>

        {errorMessage && (
          <p className="mb-5 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
            {errorMessage}
          </p>
        )}

        {isLoading && (
          <p className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
            読み込み中...
          </p>
        )}

        {!isLoading && racers.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
            登録されているレーサーがいません。
          </p>
        )}

        <div className="space-y-4">
          {racers.map((racer) => {
            const isUpdating = updatingId === racer.id;

            return (
              <article
                key={racer.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-3xl">{racer.car}</p>

                    <h2 className="mt-2 text-xl font-bold text-black">
                      {racer.name}
                    </h2>

                    <p className="mt-1 text-3xl font-black text-red-600">
                      {racer.progress}
                      <span className="ml-1 text-base text-gray-400">
                        / 100 MODEL
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isUpdating || racer.progress <= 0}
                      onClick={() => changeProgress(racer, -1)}
                      className="h-14 w-14 rounded-full border border-gray-300 bg-white text-2xl font-bold text-black disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`${racer.name}のモデル数を1減らす`}
                    >
                      −
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating || racer.progress >= 100}
                      onClick={() => changeProgress(racer, 1)}
                      className="h-14 w-14 rounded-full bg-red-600 text-2xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`${racer.name}のモデル数を1増やす`}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}