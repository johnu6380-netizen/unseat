import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF8F3]">
      <div className="w-full max-w-sm rounded-2xl border border-[#DCE5D5] bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-[#2F3B2F] mb-2">Unseat</h1>
        <p className="text-[#6B7A63] mb-6">Sign in to get started</p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-[#7C9A6B] px-4 py-2.5 text-white font-medium hover:bg-[#6B8A5B] transition-colors"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}