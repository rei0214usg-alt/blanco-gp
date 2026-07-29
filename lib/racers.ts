import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  
} from "firebase/firestore";
import { db } from "./firebase";

export type Racer = {
  id: string;
  name: string;
  progress: number;
  goal: number;
  cheers: number;
  car: string;
  branch: string;
  active: boolean;
};

const racersRef = collection(db, "staffs");

// 一覧取得
export async function getRacers(): Promise<Racer[]> {
  const snapshot = await getDocs(racersRef);

  return snapshot.docs
    .map((snapshotDoc) => {
      const data = snapshotDoc.data();

      return {
        id: snapshotDoc.id,
        name: data.name ?? "名前未設定",
        progress: data.progress ?? 0,
        goal: data.goal ?? 100,
        cheers: data.cheers ?? 0,
        car: data.car ?? "🏎️",
        branch: data.branch ?? "店舗未設定",
        active: data.active ?? true,
      };
    })
    .filter((racer) => racer.active);
}

// 新規追加
export async function addRacer(
  racer: Omit<Racer, "id">
) {
  await addDoc(racersRef, racer);
}

// 更新
export async function updateRacer(
  id: string,
  data: Partial<Racer>
) {
  const racerRef = doc(db, "staffs", id);
  await updateDoc(racerRef, data);
}