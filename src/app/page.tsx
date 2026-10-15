"use client";

import { useEffect, useState } from "react";
import { sessions } from "@/lib/sessions";
import { cn } from "@/lib/utils";

function Check({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full transition-all duration-300",
        on
          ? "btn-primary scale-100"
          : "border-[1.5px] border-black/15 bg-white/40",
      )}
    >
      <svg
        viewBox="0 0 16 16"
        className={cn(
          "size-3.5 text-white transition-opacity",
          on ? "opacity-100" : "opacity-0",
        )}
      >
        <path
          d="M3.5 8.5l3 3 6-6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function VotePage() {
  const [choice, setChoice] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/vote")
      .then((res) => res.json())
      .then((data) => setChoice(data.choice))
      .catch(() => {});
  }, []);

  const select = (sessionId: string) => {
    setError(false);
    setPending(sessionId === choice ? null : sessionId);
    requestAnimationFrame(() =>
      document
        .getElementById(`session-${sessionId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
    );
  };

  const confirm = async () => {
    if (!pending) return;
    setSaving(true);
    setError(false);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: pending }),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error();
      setChoice(pending);
      setPending(null);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  const highlighted = pending ?? choice;
  const confirmed = sessions.find((s) => s.id === choice);

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-14 pb-36">
      <div className="px-1">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
          Tonight&apos;s breakouts
        </p>
        <h1 className="mt-1.5 text-[34px] font-bold leading-[1.1] tracking-[-0.022em]">
          Choose your breakout.
        </h1>
        <p className="mt-2 text-[17px] leading-snug text-muted">
          Select a session, then confirm.
        </p>
      </div>

      {confirmed && !pending && (
        <div
          className="glass mt-7 flex items-center gap-3.5 rounded-[24px] p-4"
          aria-live="polite"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-500/15">
            <svg viewBox="0 0 16 16" className="size-5 text-green-600">
              <path
                d="M3.5 8.5l3 3 6-6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-[17px] font-semibold">You&apos;re confirmed</p>
            <p className="truncate text-[15px] text-muted">{confirmed.title}</p>
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3">
        {sessions.map((s) => {
          const on = highlighted === s.id;
          return (
            <button
              key={s.id}
              id={`session-${s.id}`}
              onClick={() => select(s.id)}
              disabled={saving}
              aria-pressed={on}
              className={cn(
                "glass flex w-full scroll-mb-36 gap-4 rounded-[28px] p-5 text-left transition-all duration-300 active:scale-[0.985]",
                on && "glass-selected",
              )}
            >
              <div className="min-w-0 flex-1">
                <h2 className="text-[19px] font-semibold leading-snug tracking-[-0.01em]">
                  {s.title}
                </h2>
                <p className="mt-1 text-[15px] font-medium text-accent">
                  {s.leader}
                </p>
                <p className="mt-2 text-[15px] leading-[1.45] text-muted">
                  {s.description}
                </p>
              </div>
              <Check on={on} />
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300",
          pending
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <div className="mx-auto max-w-lg">
          {error && (
            <p className="glass mx-auto mb-2 w-fit rounded-full px-4 py-2 text-center text-[13px] font-medium text-red-600">
              Couldn&apos;t save. Check your connection and try again.
            </p>
          )}
          <div className="glass flex gap-2 rounded-full p-1.5">
            <button
              onClick={() => setPending(null)}
              disabled={saving}
              className="rounded-full px-5 py-3 text-[17px] font-medium text-accent active:bg-black/5"
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              disabled={saving}
              className="btn-primary flex-1 rounded-full py-3 text-[17px] font-semibold text-white transition active:scale-[0.98] disabled:opacity-70"
            >
              {saving ? "Saving…" : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
