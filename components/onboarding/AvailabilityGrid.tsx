"use client";

import { useState, useRef } from "react";
import TimeInput12h from "./TimeInput12h";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as const;

type Window = { id: number };
type DayWindows = Record<number, Window[]>;

// IMPORTANT: ids must be IDENTICAL between the server render and the
// client's hydration render, or React throws a hydration mismatch and
// discards/regenerates the whole subtree — silently wiping any input the
// user had already started typing.
//
// A module-level `let nextId = 1` counter does NOT satisfy that: on the
// server it keeps incrementing across every request handled by that
// process, while the client always starts fresh at 1, so the two renders
// disagree. Seeding the initial one-window-per-day state with the day's
// own value is deterministic on both sides. Windows added later via
// addWindow() only ever happen from a client onClick handler (never during
// SSR), so a ref-based counter there is safe.
function initialDayWindows(): DayWindows {
  const init: DayWindows = {};
  for (const day of DAYS) {
    init[day.value] = [{ id: day.value }];
  }
  return init;
}

export default function AvailabilityGrid() {
  const [dayWindows, setDayWindows] = useState<DayWindows>(initialDayWindows);

  // Starts above the highest possible day value (6) so new windows never
  // collide with the deterministic initial ids. Client-only — never read
  // during SSR — so it's fine that it isn't stable across renders.
  const nextClientId = useRef(1000);

  function addWindow(dayValue: number) {
    const newWindow: Window = { id: nextClientId.current++ };
    setDayWindows((prev) => ({
      ...prev,
      [dayValue]: [...prev[dayValue], newWindow],
    }));
  }

  function removeWindow(dayValue: number, windowId: number) {
    setDayWindows((prev) => {
      const filtered = prev[dayValue].filter((w) => w.id !== windowId);
      // Always keep at least one window per day (even if blank).
      return {
        ...prev,
        [dayValue]:
          filtered.length > 0
            ? filtered
            : [{ id: nextClientId.current++ }],
      };
    });
  }

  return (
    <div className="space-y-4">
      {DAYS.map((day) => {
        const windows = dayWindows[day.value];
        return (
          <div key={day.value}>
            {/* Day label + add button */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-[#2F3B2F] w-24">
                {day.label}
              </span>
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => addWindow(day.value)}
                  className="flex items-center justify-center h-6 w-6 rounded-full border border-[#A9C29A] text-[#7C9A6B] hover:bg-[#EEF3E8] transition-colors text-sm font-bold leading-none"
                  aria-label={`Add another window for ${day.label}`}
                >
                  +
                </button>
                {/* Tooltip */}
                <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#2F3B2F] px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                  Add another window
                </div>
              </div>
            </div>

            {/* Time windows for this day */}
            <div className="space-y-2 ml-1">
              {windows.map((win) => (
                <div
                  key={win.id}
                  className="flex items-center gap-3 rounded-xl border border-[#DCE5D5] bg-white px-4 py-2.5"
                >
                  {/* Hidden field so the server knows which day this window belongs to */}
                  <input type="hidden" name="dayOfWeek" value={day.value} />

                  <div className="flex items-center gap-2 flex-1">
                    <TimeInput12h name={`startTime-${day.value}-${win.id}`} />
                    <span className="text-[#8A9A7E] text-sm">to</span>
                    <TimeInput12h name={`endTime-${day.value}-${win.id}`} />
                  </div>

                  {/* Remove button — only show when there's more than one window */}
                  {windows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWindow(day.value, win.id)}
                      className="flex-shrink-0 text-[#A9B89E] hover:text-[#C0392B] transition-colors text-lg leading-none"
                      aria-label="Remove this window"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
