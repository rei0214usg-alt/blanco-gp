"use client";

import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      setIsLoggingIn(true);
      setErrorMessage("");

      await signInWithEmailAndPassword(auth, email, password);

      router.push("/admin");
    } catch (error) {
      console.error("ログインに失敗しました:", error);
      setErrorMessage(
        "ログインできませんでした。入力内容を確認してください。"
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-5 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-red-600">
            BLANCO GP
          </p>

          <h1 className="mt-3 text-3xl font-black text-black">
            管理者ログイン
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            登録した管理者アカウントでログインしてください
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              メールアドレス
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              パスワード
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="パスワード"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-600"
            />
          </div>

          {errorMessage && (
            <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full rounded-xl bg-red-600 px-5 py-4 font-bold text-white disabled:opacity-50"
          >
            {isLoggingIn ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </section>
    </main>
  );
}