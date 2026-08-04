"use client";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import AuditionCard from "@/components/AuditionCard";
import Logo from "@/components/Logo";
import RaceTrack from "@/components/RaceTrackV2";
import { db } from "@/lib/firebase";

type Racer = {
  id: string;
  name: string;
  progress: number;
  car: string;
  auditionDate: string;
  photoURL: string;
};

export default function RacePage() {
  const [racers, setRacers] = useState<Racer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const racersCollection = collection(db, "staffs");

    const unsubscribe = onSnapshot(
      racersCollection,
      (snapshot) => {
        const racerData = snapshot.docs.map((document) => {
          const data = document.data();

          return {
  id: document.id,
  name: String(data.name ?? ""),
  progress: Number(data.progress ?? 0),
  car: String(data.car ?? "🚗"),
  auditionDate: String(data.auditionDate ?? ""),
  photoURL: String(data.photoURL ?? ""),
};
        });

        racerData.sort((a, b) => b.progress - a.progress);

        setRacers(racerData);
        setIsLoading(false);
        setErrorMessage("");
      },
      (error) => {
        console.error("Firestoreの読み込みに失敗しました:", error);
        setErrorMessage("データを読み込めませんでした");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
const nextAuditionDate =
  racers.length > 0 ? racers[0].auditionDate : "";
  return (
  <>
    <Header />

    <main className="min-h-screen bg-white px-5 py-8">
      <Logo />

      <section className="mx-auto mt-10 max-w-4xl">
        {nextAuditionDate && (
  <AuditionCard auditionDate={nextAuditionDate} />
)}

        <div className="mb-8 mt-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-red-600">
              100 MODEL RACE
            </p>

            <h2 className="mt-2 text-3xl font-bold text-black">
              デビューまでの現在地
            </h2>
          </div>

          <div className="text-3xl">🏁</div>
        </div>

        {isLoading && (
          <p className="py-10 text-center text-gray-500">
            レースデータを読み込み中...
          </p>
        )}

        {errorMessage && (
          <p className="py-10 text-center font-bold text-red-600">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && racers.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            レーサーが登録されていません
          </p>
        )}

        {!isLoading && !errorMessage && racers.length > 0 && (
          <RaceTrack racers={racers} />
        )}
      </section>
            </main>
  </>
);
}