"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type User,
  onAuthStateChanged,
} from "firebase/auth";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type SupportCommentsProps = {
  staffId: string;
};

type SupportComment = {
  id: string;
  userName: string;
  userPhotoURL: string;
  message: string;
  createdAt: Date | null;
};

export default function SupportComments({
  staffId,
}: SupportCommentsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<SupportComment[]>([]);
  const [message, setMessage] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    const commentsQuery = query(
      collection(db, "comments"),
      where("staffId", "==", staffId),
      orderBy("createdAt", "desc"),
      limit(30),
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        const nextComments = snapshot.docs.map((commentDoc) => {
          const data = commentDoc.data();

          return {
            id: commentDoc.id,
            userName:
              typeof data.userName === "string"
                ? data.userName
                : "名前未設定",
            userPhotoURL:
              typeof data.userPhotoURL === "string"
                ? data.userPhotoURL
                : "",
            message:
              typeof data.message === "string"
                ? data.message
                : "",
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : null,
          };
        });

        setComments(nextComments);
      },
      (error) => {
        console.error(
          "コメントの読み込みに失敗しました。",
          error,
        );

        setErrorMessage(
          "コメントを読み込めませんでした。",
        );
      },
    );

    return unsubscribe;
  }, [staffId]);

  const handleSubmit = async () => {
    const trimmedMessage = message.trim();

    if (!user || !trimmedMessage || isPosting) {
      return;
    }

    if (trimmedMessage.length > 200) {
      setErrorMessage(
        "コメントは200文字以内で入力してください。",
      );
      return;
    }

    setIsPosting(true);
    setErrorMessage("");

    try {
      await addDoc(collection(db, "comments"), {
        staffId,
        userId: user.uid,
        userName:
          user.displayName ??
          user.email ??
          "名前未設定",
        userEmail: user.email ?? "",
        userPhotoURL: user.photoURL ?? "",
        message: trimmedMessage,
        createdAt: serverTimestamp(),
      });

      setMessage("");
    } catch (error) {
      console.error(
        "コメントの投稿に失敗しました。",
        error,
      );

      setErrorMessage(
        "コメントを投稿できませんでした。",
      );
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "投稿中...";
    }

    return new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
      <div>
        <p className="text-xs font-black tracking-[0.25em] text-red-400">
          SUPPORT COMMENTS
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          応援メッセージ
        </h2>
      </div>

      {isAuthLoading ? (
        <p className="mt-5 text-sm text-neutral-400">
          ログイン状態を確認しています...
        </p>
      ) : user ? (
        <div className="mt-5">
          <p className="mb-3 text-xs text-neutral-500">
            {user.displayName ?? user.email}
            さんとして投稿します
          </p>

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            maxLength={200}
            placeholder="応援メッセージを書いてみよう！"
            className="min-h-[120px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500/50"
          />

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-neutral-600">
              同じ人でも何度でも投稿できます
            </p>

            <p className="text-xs text-neutral-500">
              {message.length}/200
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isPosting ||
              message.trim().length === 0
            }
            className="mt-4 w-full rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:-translate-y-0.5 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPosting
              ? "投稿しています..."
              : "コメントを投稿"}
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5 text-center">
          <p className="text-sm text-neutral-400">
            コメントするにはログインが必要です
          </p>

          <Link
            href="/login"
            className="mt-4 block rounded-xl bg-white px-4 py-3 font-black text-black"
          >
            Googleでログイン
          </Link>
        </div>
      )}

      {errorMessage && (
        <p className="mt-4 text-sm font-bold text-red-400">
          {errorMessage}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-center gap-3">
              {comment.userPhotoURL ? (
                <img
                  src={comment.userPhotoURL}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  👤
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {comment.userName}
                </p>

                <p className="text-xs text-neutral-500">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-wrap break-words leading-7 text-neutral-300">
              {comment.message}
            </p>
          </article>
        ))}

        {comments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
            <p className="text-sm text-neutral-500">
              まだコメントはありません。
            </p>

            <p className="mt-2 text-sm font-bold text-white">
              最初の応援メッセージを届けよう！
            </p>
          </div>
        )}
      </div>
    </section>
  );
}