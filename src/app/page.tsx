"use client";

import { useEffect, useState } from "react";
import { sessions } from "@/lib/sessions";
import { cn } from "@/lib/utils";

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
  const pendingSession = sessions.find((s) => s.id === pending);
  const confirmed = sessions.find((s) => s.id === choice);

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-10 pb-40">
      <p className="text-sm font-medium uppercase tracking-widest text-stone-500">
        Tonight&apos;s breakouts
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight">
        Which session will you join?
      </h1>
      <p className="mt-3 text-stone-600">
        Pick one, then confirm. It helps us put each group in the right-sized
        room.
      </p>

      {confirmed && !pending && (
        <div
          className="mt-6 rounded-2xl p-4 text-white"
          style={{ background: confirmed.color }}
          aria-live="polite"
        >
          <p className="font-serif text-xl font-semibold">You&apos;re in!</p>
          <p className="mt-1 text-sm text-white/90">
            You&apos;re confirmed for <strong>{confirmed.title}</strong>.
            Changed your mind? Pick another session and confirm again.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {sessions.map((s) => {
          const isHighlighted = highlighted === s.id;
          return (
            <button
              key={s.id}
              onClick={() => select(s.id)}
              disabled={saving}
              aria-pressed={isHighlighted}
              className={cn(
                "rounded-2xl border-2 bg-white p-5 text-left shadow-sm transition active:scale-[0.99]",
                isHighlighted ? "border-current" : "border-transparent",
              )}
              style={{ color: isHighlighted ? s.color : undefined }}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-xl font-semibold leading-snug text-stone-900">
                  {s.title}
                </h2>
                <span
                  className={cn(
                    "mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                    isHighlighted ? "border-current bg-current" : "border-stone-300",
                  )}
                >
                  {isHighlighted && (
                    <svg viewBox="0 0 16 16" className="size-3.5 text-white">
                      <path
                        d="M3 8.5l3 3 7-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium" style={{ color: s.color }}>
                Led by {s.leader}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {s.description}
              </p>
            </button>
          );
        })}
      </div>

      {pendingSession && (
        <div className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-background/95 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
          <div className="mx-auto max-w-lg">
            <p className="text-sm text-stone-600">
              {choice ? "Switch to" : "Your choice"}:{" "}
              <strong className="text-stone-900">{pendingSession.title}</strong>
            </p>
            {error && (
              <p className="mt-1 text-sm text-red-700">
                Something went wrong. Please try again.
              </p>
            )}
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => setPending(null)}
                disabled={saving}
                className="rounded-full border border-stone-300 px-5 py-3 font-medium text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={confirm}
                disabled={saving}
                className="flex-1 rounded-full px-5 py-3 font-semibold text-white disabled:opacity-70"
                style={{ background: pendingSession.color }}
              >
                {saving ? "Saving…" : "Confirm my choice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
