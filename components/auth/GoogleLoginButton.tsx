"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function GoogleLoginButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      await setDoc(
        doc(db, "users", loggedInUser.uid),
        {
          uid: loggedInUser.uid,
          name:
            loggedInUser.displayName ??
            loggedInUser.email ??
            "名前未設定",
          email: loggedInUser.email ?? "",
          photoURL: loggedInUser.photoURL ?? "",
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );

      setUser(loggedInUser);
    } catch (error) {
      console.error("Googleログインに失敗しました。", error);
      setErrorMessage("Googleログインに失敗しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトに失敗しました。", error);
      setErrorMessage("ログアウトに失敗しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-400">
        ログイン状態を確認中...
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              👤
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">
              {user.displayName ?? "ログイン中"}
            </p>

            <p className="truncate text-xs text-neutral-400">
              {user.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isProcessing}
          className="mt-4 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-neutral-300 transition hover:bg-white/5 disabled:opacity-50"
        >
          {isProcessing ? "処理中..." : "ログアウト"}
        </button>

        {errorMessage && (
          <p className="mt-3 text-sm font-bold text-red-400">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogin}
        disabled={isProcessing}
        className="w-full rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:-translate-y-0.5 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing
          ? "ログインしています..."
          : "Googleでログイン"}
      </button>

      {errorMessage && (
        <p className="mt-3 text-center text-sm font-bold text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}