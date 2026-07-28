"use client";

import { useEffect, useState } from "react";
import { getRacers, Racer } from "@/lib/racers";

export default function RacersPage() {
  const [racers, setRacers] = useState<Racer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getRacers();
      setRacers(data);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        🏎️ レーサー管理
      </h1>

      <button className="mb-6 rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700">
        ＋ レーサー追加
      </button>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="space-y-4">
          {racers.map((racer) => (
            <div
              key={racer.id}
              className="rounded-xl border border-gray-700 bg-zinc-900 p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold text-lg">
                  {racer.car} {racer.name}
                </h2>

                <p className="text-gray-400">
                  {racer.progress} / {racer.goal}
                </p>

                <p className="text-sm text-gray-500">
                  {racer.branch}
                </p>
              </div>

              <button className="rounded bg-gray-700 px-3 py-1 hover:bg-gray-600">
                編集
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}