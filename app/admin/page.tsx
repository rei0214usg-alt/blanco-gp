"use client";
import EditStaffForm from "./components/EditStaffForm";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

import { auth, db, storage } from "@/lib/firebase";

type Racer = {
  id: string;
  name: string;
  progress: number;
  car: string;
  auditionDate: string;
  challengeStatement: string;
  status: string;
  photoURL: string;
  machineImageURL: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [racers, setRacers] = useState<Racer[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [tokaiAuditionDate, setTokaiAuditionDate] = useState("");
const [tokyoAuditionDate, setTokyoAuditionDate] = useState("");
const [isSavingAuditionDates, setIsSavingAuditionDates] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
const [newName, setNewName] = useState("");
const [newCar, setNewCar] = useState("🚗");
const [newProgress, setNewProgress] = useState(0);
const [newAuditionDate, setNewAuditionDate] = useState("");
const [newChallengeStatement, setNewChallengeStatement] = useState("");
const [newStatus, setNewStatus] = useState("MODEL_CHALLENGE");
const [isAddingStaff, setIsAddingStaff] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCar, setEditCar] = useState("");
  const [editProgress, setEditProgress] = useState(0);
  const [editAuditionDate, setEditAuditionDate] = useState("");
  const [editChallengeStatement, setEditChallengeStatement] = useState("");
  const [editStatus, setEditStatus] = useState("MODEL_CHALLENGE");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
const [uploadingPhoto, setUploadingPhoto] = useState(false);

useEffect(() => {
  async function loadAuditionDates() {
    try {
      const auditionRef = doc(db, "settings", "audition");
      const auditionSnap = await getDoc(auditionRef);

      if (auditionSnap.exists()) {
        const data = auditionSnap.data();

        setTokaiAuditionDate(String(data.tokaiDate ?? ""));
        setTokyoAuditionDate(String(data.tokyoDate ?? ""));
      }
    } catch (error) {
      console.error("オーディション日の読み込みに失敗しました:", error);
    }
  }

  loadAuditionDates();
}, []);

useEffect(() => {
    let unsubscribeRacers: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsCheckingAuth(false);
        router.replace("/admin/login");
        return;
      }

      setIsCheckingAuth(false);

      const racersCollection = collection(db, "staffs");

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
  auditionDate: String(data.auditionDate ?? ""),
  challengeStatement: String(data.challengeStatement ?? ""),
  status: String(data.status ?? "MODEL_CHALLENGE"),
  photoURL: String(data.photoURL ?? ""),
  machineImageURL: String(data.machineImageURL ?? ""),
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

  async function addStaff() {
  if (!newName.trim()) {
    setErrorMessage("スタッフ名を入力してください。");
    return;
  }

  try {
    setIsAddingStaff(true);
    setErrorMessage("");

    await addDoc(collection(db, "staffs"), {
      name: newName.trim(),
      car: newCar.trim() || "🚗",
      progress: newProgress,
      auditionDate: newAuditionDate,
      challengeStatement: newChallengeStatement.trim(),
      status: newStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setNewName("");
    setNewCar("🚗");
    setNewProgress(0);
    setNewAuditionDate("");
    setNewChallengeStatement("");
    setNewStatus("MODEL_CHALLENGE");
  } catch (error) {
    console.error("スタッフの追加に失敗しました:", error);
    setErrorMessage("スタッフを追加できませんでした。");
  } finally {
    setIsAddingStaff(false);
  }
}
function startEditing(racer: Racer) {
  setEditingId(racer.id);
  setEditName(racer.name);
  setEditCar(racer.car);
  setEditProgress(racer.progress);
  setEditAuditionDate(racer.auditionDate);
  setEditChallengeStatement(racer.challengeStatement);
  setEditStatus(racer.status);
  setSelectedPhoto(null);
  setErrorMessage("");
}
async function saveEdit() {
  if (!editingId) {
    return;
  }

  if (!editName.trim()) {
    setErrorMessage("スタッフ名を入力してください。");
    return;
  }

  if (editProgress < 0 || editProgress > 100) {
    setErrorMessage("進捗は0〜100で入力してください。");
    return;
  }

  if (
    selectedPhoto &&
    !["image/jpeg", "image/png", "image/webp"].includes(
      selectedPhoto.type
    )
  ) {
    setErrorMessage(
      "プロフィール画像はJPG・PNG・WebPを選択してください。"
    );
    return;
  }

  if (selectedPhoto && selectedPhoto.size > 5 * 1024 * 1024) {
    setErrorMessage("プロフィール画像は5MB以下にしてください。");
    return;
  }

  try {
    setIsSavingEdit(true);
    setUploadingPhoto(Boolean(selectedPhoto));
    setErrorMessage("");

    const staffReference = doc(db, "staffs", editingId);

    let photoURL: string | undefined;

    if (selectedPhoto) {
      const extension =
        selectedPhoto.name.split(".").pop()?.toLowerCase() || "jpg";

      const photoReference = ref(
        storage,
        `staff-photos/${editingId}/profile-${Date.now()}.${extension}`
      );

      const uploadResult = await uploadBytes(
        photoReference,
        selectedPhoto,
        {
          contentType: selectedPhoto.type,
        }
      );

      photoURL = await getDownloadURL(uploadResult.ref);
    }

    await updateDoc(staffReference, {
      name: editName.trim(),
      car: editCar.trim() || "🚗",
      progress: editProgress,
      auditionDate: editAuditionDate,
      challengeStatement: editChallengeStatement.trim(),
      status: editStatus,
      ...(photoURL ? { photoURL } : {}),
      updatedAt: serverTimestamp(),
    });

    setSelectedPhoto(null);
    setEditingId(null);
  } catch (error) {
    console.error("スタッフ情報の更新に失敗しました:", error);
    setErrorMessage(
      "スタッフ情報または画像を更新できませんでした。"
    );
  } finally {
    setIsSavingEdit(false);
    setUploadingPhoto(false);
  }
}
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

      const racerReference = doc(db, "staffs", racer.id);

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
async function saveAuditionDates() {
  try {
    setIsSavingAuditionDates(true);

    const auditionRef = doc(db, "settings", "audition");

    await setDoc(
      auditionRef,
      {
        tokaiDate: tokaiAuditionDate,
        tokyoDate: tokyoAuditionDate,
      },
      { merge: true }
    );

    alert("オーディション日を保存しました！");
  } catch (error) {
    console.error("オーディション日の保存に失敗しました:", error);
    alert("保存に失敗しました");
  } finally {
    setIsSavingAuditionDates(false);
  }
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
<section className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
  <p className="text-sm font-bold tracking-[0.2em] text-red-600">
    🏁 AUDITION SETTINGS
  </p>

  <h2 className="mt-2 text-2xl font-black text-black">
    次回オーディション日
  </h2>

  <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        東海
      </label>

      <input
        type="date"
        value={tokaiAuditionDate}
        onChange={(event) => setTokaiAuditionDate(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        東京
      </label>

      <input
        type="date"
        value={tokyoAuditionDate}
        onChange={(event) => setTokyoAuditionDate(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
      />
    </div>
  </div>

  <button
    type="button"
    onClick={saveAuditionDates}
    disabled={isSavingAuditionDates}
    className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-bold text-white disabled:opacity-50"
  >
    {isSavingAuditionDates ? "保存中..." : "日程を保存"}
  </button>
</section>
        {errorMessage && (
          <p className="mb-5 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
            {errorMessage}
          </p>
        )}
<div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
  <div className="mb-5">
    <p className="text-sm font-bold tracking-[0.15em] text-red-600">
      NEW STAFF
    </p>

    <h2 className="mt-2 text-2xl font-black text-black">
      スタッフを追加
    </h2>
  </div>

  <div className="space-y-4">
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        名前
      </label>

      <input
        type="text"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        placeholder="例：田中太郎"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
      />
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          車
        </label>

        <input
          type="text"
          value={newCar}
          onChange={(event) => setNewCar(event.target.value)}
          placeholder="🚗"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          初期進捗
        </label>

        <input
          type="number"
          min="0"
          max="100"
          value={newProgress}
          onChange={(event) =>
            setNewProgress(Number(event.target.value))
          }
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
        />
      </div>
    </div>

    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        オーディション日
      </label>

      <input
        type="date"
        value={newAuditionDate}
        onChange={(event) => setNewAuditionDate(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        挑戦宣言
      </label>

      <textarea
        value={newChallengeStatement}
        onChange={(event) =>
          setNewChallengeStatement(event.target.value)
        }
        placeholder="どんなスタイリストを目指すか入力してください。"
        rows={4}
        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        ステータス
      </label>

      <select
        value={newStatus}
        onChange={(event) => setNewStatus(event.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-red-500"
      >
        <option value="MODEL_CHALLENGE">100人モデル挑戦中</option>
        <option value="MODEL_COMPLETE">100人モデル達成</option>
        <option value="AUDITION">オーディション</option>
        <option value="STYLIST">スタイリスト</option>
      </select>
    </div>

    <button
      type="button"
      onClick={addStaff}
      disabled={isAddingStaff}
      className="w-full rounded-xl bg-red-600 px-5 py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isAddingStaff ? "追加中..." : "スタッフを追加する"}
    </button>
  </div>
</div>
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
<button
  type="button"
  onClick={() => startEditing(racer)}
  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700"
>
  編集
</button>
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
                {editingId === racer.id && (
                  <EditStaffForm
                    editName={editName}
                    editCar={editCar}
                    editProgress={editProgress}
                    editAuditionDate={editAuditionDate}
                    editChallengeStatement={editChallengeStatement}
                    editStatus={editStatus}
                    isSavingEdit={isSavingEdit}
                    selectedPhoto={selectedPhoto}
uploadingPhoto={uploadingPhoto}
onSelectPhoto={setSelectedPhoto}

                    onChangeName={setEditName}
                    onChangeCar={setEditCar}
                    onChangeProgress={setEditProgress}
                    onChangeAuditionDate={setEditAuditionDate}
                    onChangeChallengeStatement={setEditChallengeStatement}
                    onChangeStatus={setEditStatus}
                    onSave={saveEdit}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}