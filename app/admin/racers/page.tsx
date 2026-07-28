"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  addRacer,
  getRacers,
  Racer,
  updateRacer,
} from "@/lib/racers";

export default function RacersPage() {
  const [racers, setRacers] = useState<Racer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [progress, setProgress] = useState(0);
  const [car, setCar] = useState("🏎️");

  async function loadRacers() {
    try {
      const data = await getRacers();
      setRacers(data);
    } catch (error) {
      console.error(error);
      alert("レーサー情報の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRacers();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      alert("名前を入力してください");
      return;
    }

    setSaving(true);

    try {
      await addRacer({
        name: name.trim(),
        branch: branch.trim() || "店舗未設定",
        progress,
        goal: 100,
        cheers: 0,
        car,
        active: true,
      });

      setName("");
      setBranch("");
      setProgress(0);
      setCar("🏎️");
      setShowForm(false);

      await loadRacers();
    } catch (error) {
      console.error(error);
      alert("レーサーの追加に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  async function changeProgress(racer: Racer, amount: number) {
    if (updatingId) return;

    const goal = racer.goal > 0 ? racer.goal : 100;

    const nextProgress = Math.min(
      goal,
      Math.max(0, racer.progress + amount)
    );

    if (nextProgress === racer.progress) return;

    setUpdatingId(racer.id);

    setRacers((currentRacers) =>
      currentRacers.map((currentRacer) =>
        currentRacer.id === racer.id
          ? { ...currentRacer, progress: nextProgress }
          : currentRacer
      )
    );

    try {
      await updateRacer(racer.id, {
        progress: nextProgress,
      });
    } catch (error) {
      console.error(error);

      setRacers((currentRacers) =>
        currentRacers.map((currentRacer) =>
          currentRacer.id === racer.id
            ? { ...currentRacer, progress: racer.progress }
            : currentRacer
        )
      );

      alert("モデル数の更新に失敗しました");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-bold tracking-[0.3em] text-red-500">
              BLANCO GP
            </p>

            <h1 className="text-3xl font-black sm:text-4xl">
              🏎️ レーサー管理
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              スタイリストデビューまでの進捗を管理します
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="rounded-xl bg-red-600 px-5 py-3 font-bold transition hover:bg-red-700"
          >
            {showForm ? "追加フォームを閉じる" : "＋ レーサー追加"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 space-y-5 rounded-2xl border border-zinc-700 bg-zinc-900 p-6"
          >
            <div>
              <h2 className="text-xl font-bold">
                新しいレーサーを追加
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                保存するとレース画面にも反映されます
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  名前
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
                  placeholder="例：山田太郎"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  店舗
                </label>

                <input
                  type="text"
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
                  placeholder="例：岐阜"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  現在のモデル数
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(event) =>
                    setProgress(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  車
                </label>

                <select
                  value={car}
                  onChange={(event) => setCar(event.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
                >
                  <option value="🏎️">🏎️ レーシングカー</option>
                  <option value="🚗">🚗 赤い車</option>
                  <option value="🚙">🚙 SUV</option>
                  <option value="🚕">🚕 タクシー</option>
                  <option value="🚓">🚓 パトカー</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-red-600 px-6 py-3 font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "保存中..." : "レーサーを保存"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
            読み込み中...
          </div>
        ) : racers.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <p className="text-lg font-bold">
              表示できるレーサーがいません
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              「＋ レーサー追加」から登録してください
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {racers.map((racer) => {
              const goal = racer.goal > 0 ? racer.goal : 100;

              const achievementRate = Math.min(
                100,
                Math.max(
                  0,
                  Math.round((racer.progress / goal) * 100)
                )
              );

              const remaining = Math.max(
                0,
                goal - racer.progress
              );

              const isUpdating = updatingId === racer.id;
              const isGoal = racer.progress >= goal;

              return (
                <article
                  key={racer.id}
                  className={`overflow-hidden rounded-2xl border bg-zinc-900 transition ${
                    isGoal
                      ? "border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
                      : "border-zinc-700"
                  }`}
                >
                  <div
                    className={`h-1.5 w-full ${
                      isGoal ? "bg-yellow-500" : "bg-red-600"
                    }`}
                  />

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">
                                {racer.car}
                              </span>

                              <div>
                                <h2 className="text-xl font-black sm:text-2xl">
                                  {racer.name}
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                  {racer.branch}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p
                              className={`text-2xl font-black ${
                                isGoal
                                  ? "text-yellow-400"
                                  : "text-red-500"
                              }`}
                            >
                              {achievementRate}%
                            </p>

                            <p className="text-xs font-bold tracking-wider text-zinc-500">
                              COMPLETE
                            </p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="h-4 overflow-hidden rounded-full border border-zinc-700 bg-black">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isGoal
                                  ? "bg-yellow-500"
                                  : "bg-red-600"
                              }`}
                              style={{
                                width: `${achievementRate}%`,
                              }}
                            />
                          </div>

                          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-bold text-zinc-300">
                              {isGoal
                                ? "🏁 100人モデル達成！"
                                : `あと${remaining}人でデビュー`}
                            </p>

                            <p className="text-sm text-zinc-500">
                              {racer.progress} / {goal} MODEL
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-4 rounded-2xl border border-zinc-800 bg-black p-4">
                        <button
                          type="button"
                          onClick={() =>
                            changeProgress(racer, -1)
                          }
                          disabled={
                            isUpdating || racer.progress <= 0
                          }
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 text-2xl font-bold transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={`${racer.name}のモデル数を1減らす`}
                        >
                          −
                        </button>

                        <div className="min-w-24 text-center">
                          <p className="text-3xl font-black">
                            {racer.progress}
                          </p>

                          <p className="mt-1 text-xs font-bold tracking-wider text-zinc-500">
                            {isUpdating
                              ? "更新中..."
                              : "MODEL"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            changeProgress(racer, 1)
                          }
                          disabled={
                            isUpdating ||
                            racer.progress >= goal
                          }
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-2xl font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={`${racer.name}のモデル数を1増やす`}
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}