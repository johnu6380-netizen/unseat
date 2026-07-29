"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type ConsentCheckboxProps = {
  dysfunctionLabel: string;
};

export default function ConsentCheckbox({ dysfunctionLabel }: ConsentCheckboxProps) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!checked) return;
    setLoading(true);
    await signIn("google", { callbackUrl: "/availability" });
  }

  return (
    <div className="rounded-2xl border border-[#DCE5D5] bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-[#2F3B2F] mb-1">
        Save your plan &amp; schedule sessions
      </h2>
      <p className="text-sm text-[#6B7A63] mb-5">
        Sign in with Google to save your {dysfunctionLabel} plan and have Unseat
        automatically schedule corrective sessions on your calendar.
      </p>

      <label className="flex items-start gap-3 cursor-pointer mb-5 group">
        <div className="mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="h-4 w-4 rounded border-[#A9C29A] text-[#7C9A6B] focus:ring-[#7C9A6B] cursor-pointer"
          />
        </div>
        <span className="text-sm text-[#3D4A37] leading-relaxed">
          I have read and agree to the{" "}
          <a
            href="/consent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7C9A6B] hover:underline font-medium"
          >
            Informed Consent &amp; Liability Waiver
          </a>
          {" "}and the{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7C9A6B] hover:underline font-medium"
          >
            Terms of Service
          </a>
          . I understand that Unseat provides general wellness information only,
          not medical advice, and that physical exercise carries inherent risks.
          I am 18 years of age or older.
        </span>
      </label>

      <button
        onClick={handleSubmit}
        disabled={!checked || loading}
        className={`w-full rounded-lg px-4 py-3 font-medium transition-all duration-150 ${
          checked && !loading
            ? "bg-[#7C9A6B] text-white hover:bg-[#6B8A5B] shadow-sm"
            : "bg-[#DCE5D5] text-[#8A9A7E] cursor-not-allowed"
        }`}
      >
        {loading ? "Redirecting to Google…" : "Save my plan"}
      </button>

      {!checked && (
        <p className="text-xs text-[#8A9A7E] text-center mt-3">
          Please read and accept the terms above to continue.
        </p>
      )}
    </div>
  );
}
