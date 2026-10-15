"use client";

import { useState } from "react";
import { sessions } from "@/lib/sessions";
import { useCounts } from "@/components/use-counts";

export default function ResultsPage() {
  const counts = useCounts(2000);
  const [confirming, setConfirming] = useState(false);

  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const ranked = [...sessions].sort(
    (a, b) => (counts?.[b.id] ?? 0) - (counts?.[a.id] ?? 0),
  );

  const reset = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    await fetch("/api/reset", { method: "POST" });
    setConfirming(false);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-stone-500">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-600" />
            </span>
            Live results
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold">
            Breakout headcount
          </h1>
        </div>
        <div className="text-right">
          <p className="font-serif text-5xl font-semibold tabular-nums">
            {counts ? total : "–"}
          </p>
          <p className="text-sm text-stone-500">total responses</p>
        </div>
      </div>

      <ol className="mt-10 flex flex-col gap-4">
        {ranked.map((s, i) => {
          const n = counts?.[s.id] ?? 0;
          const pct = total ? Math.round((n / total) * 100) : 0;
          return (
            <li key={s.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                    #{i + 1} {i === 0 && total > 0 && "· biggest room"}
                  </p>
                  <h2 className="mt-1 font-serif text-xl font-semibold leading-snug">
                    {s.title}
                  </h2>
                  <p className="text-sm" style={{ color: s.color }}>
                    {s.leader}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-serif text-4xl font-semibold tabular-nums">
                    {n}
                  </p>
                  <p className="text-sm text-stone-500 tabular-nums">{pct}%</p>
                </div>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${pct}%`, background: s.color }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 flex justify-end">
        <button
          onClick={reset}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:border-red-400 hover:text-red-700"
        >
          {confirming ? "Tap again to clear all votes" : "Reset counts"}
        </button>
      </div>
    </main>
  );
}
