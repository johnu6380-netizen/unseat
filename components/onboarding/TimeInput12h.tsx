"use client";

import { useState, useEffect } from "react";

type TimeInput12hProps = {
  name: string;
  defaultValue?: string; // "HH:MM" 24-hour format
};

/**
 * 12-hour time input with:
 * - Free-text hour field (1–12)
 * - Free-text minute field (00–59) — user can type any valid minute
 * - AM/PM toggle that auto-defaults based on the typed hour:
 *     7–12 → AM, 1–6 → PM (can be overridden manually)
 * - Submits a hidden 24-hour "HH:MM" value so the server never changes.
 */
export default function TimeInput12h({
  name,
  defaultValue,
}: TimeInput12hProps) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [periodTouchedManually, setPeriodTouchedManually] = useState(false);

  useEffect(() => {
    if (!defaultValue) return;
    const [h24Str, mStr] = defaultValue.split(":");
    const h24 = parseInt(h24Str, 10);
    if (Number.isNaN(h24)) return;

    const isPM = h24 >= 12;
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;

    setHour(String(h12));
    setMinute(mStr ?? "00");
    setPeriod(isPM ? "PM" : "AM");
    setPeriodTouchedManually(true);
  }, [defaultValue]);

  function handleHourChange(raw: string) {
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 2);
    setHour(digitsOnly);

    const parsed = parseInt(digitsOnly, 10);
    if (!digitsOnly || Number.isNaN(parsed)) return;

    if (!periodTouchedManually) {
      if (parsed >= 7 && parsed <= 12) setPeriod("AM");
      else if (parsed >= 1 && parsed <= 6) setPeriod("PM");
    }
  }

  function handleMinuteChange(raw: string) {
    // Only digits, max 2 characters, clamp to 59 on blur
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 2);
    setMinute(digitsOnly);
  }

  function handleMinuteBlur() {
    if (!minute) {
      setMinute("00");
      return;
    }
    const parsed = parseInt(minute, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setMinute("00");
    } else if (parsed > 59) {
      setMinute("59");
    } else {
      // Pad single digit on blur: "5" → "05"
      setMinute(String(parsed).padStart(2, "0"));
    }
  }

  function handlePeriodClick(next: "AM" | "PM") {
    setPeriod(next);
    setPeriodTouchedManually(true);
  }

  function to24Hour(): string {
    const h12 = parseInt(hour, 10);
    if (!hour || Number.isNaN(h12) || h12 < 1 || h12 > 12) return "";

    let h24 = h12 % 12;
    if (period === "PM") h24 += 12;

    const hh = String(h24).padStart(2, "0");
    const mm = (minute || "00").padStart(2, "0");
    return `${hh}:${mm}`;
  }

  const inputClass =
    "w-10 rounded-md border border-[#DCE5D5] px-1.5 py-1.5 text-sm text-center text-[#3D4A37] focus:outline-none focus:ring-2 focus:ring-[#7C9A6B]";

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={to24Hour()} />

      {/* Hour */}
      <input
        type="text"
        inputMode="numeric"
        placeholder="--"
        value={hour}
        onChange={(e) => handleHourChange(e.target.value)}
        className={inputClass}
      />

      <span className="text-[#8A9A7E] text-sm font-medium">:</span>

      {/* Minute — free text, any value 00–59 */}
      <input
        type="text"
        inputMode="numeric"
        placeholder="00"
        value={minute}
        onChange={(e) => handleMinuteChange(e.target.value)}
        onBlur={handleMinuteBlur}
        className={inputClass}
      />

      {/* AM / PM toggle */}
      <div className="flex rounded-md border border-[#DCE5D5] overflow-hidden ml-1">
        <button
          type="button"
          onClick={() => handlePeriodClick("AM")}
          className={`px-2 py-1.5 text-xs font-medium transition-colors ${
            period === "AM"
              ? "bg-[#7C9A6B] text-white"
              : "bg-white text-[#8A9A7E] hover:bg-[#F5F8F2]"
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => handlePeriodClick("PM")}
          className={`px-2 py-1.5 text-xs font-medium transition-colors ${
            period === "PM"
              ? "bg-[#7C9A6B] text-white"
              : "bg-white text-[#8A9A7E] hover:bg-[#F5F8F2]"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
}
