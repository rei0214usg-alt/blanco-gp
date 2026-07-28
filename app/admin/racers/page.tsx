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

    const nextProgress = Math.min(
      racer.goal,
      Math.max(0, racer.progress + amount)
    );

    if (nextProgress === racer.progress) return;

    setUpdatingId(racer.id);

    // ボタンを押した瞬間に画面上の数字を変更
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

      // 保存に失敗した場合は元の数字に戻す
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
    <main className="min-h-screen bg-black p-8 text-white">
      <h1 className="mb-6 text-3xl font-bold">
        🏎️ レーサー管理
      </h1>

      <button
        type="button"
        onClick={() => setShowForm((current) => !current)}
        className="mb-6 rounded-lg bg-red-600 px-4 py-2 font-bold hover:bg-red-700"
      >
        {showForm ? "閉じる" : "＋ レーサー追加"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 max-w-xl space-y-4 rounded-xl border border-gray-700 bg-zinc-900 p-6"
        >
          <div>
            <label className="mb-1 block text-sm text-gray-300">
              名前
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-black px-3 py-2 text-white"
              placeholder="例：山田太郎"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">
              店舗
            </label>

            <input
              type="text"
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-black px-3 py-2 text-white"
              placeholder="例：岐阜"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">
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
              className="w-full rounded-lg border border-gray-600 bg-black px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">
              車
            </label>

            <select
              value={car}
              onChange={(event) => setCar(event.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-black px-3 py-2 text-white"
            >
              <option value="🏎️">🏎️ レーシングカー</option>
              <option value="🚗">🚗 赤い車</option>
              <option value="🚙">🚙 SUV</option>
              <option value="🚕">🚕 タクシー</option>
              <option value="🚓">🚓 パトカー</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red-600 px-5 py-2 font-bold hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </form>
      )}

      {loading ? (
        <p>読み込み中...</p>
      ) : racers.length === 0 ? (
        <p className="text-gray-400">
          表示できるレーサーがいません。
        </p>
      ) : (
        <div className="space-y-4">
          {racers.map((racer) => {
            const isUpdating = updatingId === racer.id;

            return (
              <div
                key={racer.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-700 bg-zinc-900 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold">
                    {racer.car} {racer.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {racer.branch}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => changeProgress(racer, -1)}
                    disabled={isUpdating || racer.progress <= 0}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-700 text-2xl font-bold hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`${racer.name}のモデル数を1減らす`}
                  >
                    −
                  </button>

                  <div className="min-w-28 text-center">
                    <p className="text-2xl font-bold">
                      {racer.progress}
                      <span className="text-base text-gray-400">
                        {" "}
                        / {racer.goal}
                      </span>
                    </p>

                    <p className="text-xs text-gray-500">
                      {isUpdating ? "更新中..." : "MODEL"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => changeProgress(racer, 1)}
                    disabled={
                      isUpdating || racer.progress >= racer.goal
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-2xl font-bold hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`${racer.name}のモデル数を1増やす`}
                  >
                    ＋
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}