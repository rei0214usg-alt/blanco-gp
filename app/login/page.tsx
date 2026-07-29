import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8 shadow-2xl">

        <div className="text-center">

          <p className="text-red-500 font-black tracking-[0.35em] text-xs">
            BLANCO GP
          </p>

          <h1 className="mt-3 text-4xl font-black text-white italic">
            WELCOME
          </h1>

          <p className="mt-4 text-neutral-400 leading-7">
            応援されるスタイリストを育てる
            <br />
            社内チャレンジプラットフォーム
          </p>

        </div>

        <div className="mt-10">
          <GoogleLoginButton />
        </div>

      </div>
    </main>
  );
}