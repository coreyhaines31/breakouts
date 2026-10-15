"use client";

import { useState } from "react";
import { sessions } from "@/lib/sessions";
import { useCounts } from "@/components/use-counts";
import { cn } from "@/lib/utils";

export default function ResultsPage() {
  const { counts, stale, refresh } = useCounts(2000);
  const [confirming, setConfirming] = useState(false);
  const [resetFailed, setResetFailed] = useState(false);

  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const ranked = [...sessions].sort(
    (a, b) => (counts?.[b.id] ?? 0) - (counts?.[a.id] ?? 0),
  );
  const top = counts?.[ranked[0].id] ?? 0;
  const tiedForTop = ranked.filter((s) => (counts?.[s.id] ?? 0) === top).length;

  const reset = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    setConfirming(false);
    const res = await fetch("/api/reset", { method: "POST" }).catch(() => null);
    if (!res?.ok) setResetFailed(true);
    else {
      setResetFailed(false);
      refresh();
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p
            className={cn(
              "flex items-center gap-2 text-[13px] font-medium",
              stale ? "text-amber-600" : "text-muted",
            )}
          >
            <span
              className={cn(
                "inline-flex size-2 rounded-full",
                stale ? "bg-amber-500" : "bg-green-500",
              )}
            />
            {stale ? "Reconnecting… numbers may be behind" : "Live"}
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight sm:text-[34px]">
            Breakout headcount
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[30px] font-semibold tabular-nums leading-none sm:text-[34px]">
            {counts ? total : "–"}
          </p>
          <p className="mt-1 text-[13px] text-muted">responses</p>
        </div>
      </div>

      <ol className="mt-8 overflow-hidden rounded-2xl bg-white">
        {ranked.map((s, i) => {
          const n = counts?.[s.id] ?? 0;
          const pct = total ? Math.round((n / total) * 100) : 0;
          const isTop = top > 0 && n === top;
          return (
            <li
              key={s.id}
              className={cn("p-5", i > 0 && "border-t border-hairline/70")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-[17px] font-semibold leading-snug">
                    {s.title}
                  </h2>
                  <p className="mt-0.5 text-[15px] text-muted">
                    {s.leader}
                    {isTop &&
                      (tiedForTop > 1 ? " · Tied for biggest" : " · Biggest room")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[28px] font-semibold tabular-nums leading-none">
                    {n}
                  </p>
                  <p className="mt-1 text-[13px] text-muted tabular-nums">
                    {pct}%
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4">
        <p className="text-[15px] text-muted">
          {resetFailed
            ? "Reset didn't go through. Try again."
            : confirming
              ? "This clears every vote."
              : "Clear test votes before the meeting."}
        </p>
        <button
          onClick={reset}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-[15px] font-medium transition",
            confirming ? "bg-red-600 text-white" : "bg-background text-red-600",
          )}
        >
          {confirming ? "Confirm Reset" : "Reset"}
        </button>
      </div>
    </main>
  );
}
