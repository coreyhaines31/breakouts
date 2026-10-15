"use client";

import { useEffect, useState } from "react";
import { sessions } from "@/lib/sessions";
import { cn } from "@/lib/utils";

export default function VotePage() {
  const [choice, setChoice] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/vote")
      .then((res) => res.json())
      .then((data) => setChoice(data.choice))
      .catch(() => {});
  }, []);

  const vote = async (sessionId: string) => {
    setSaving(sessionId);
    setError(false);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error();
      setChoice(sessionId);
    } catch {
      setError(true);
    } finally {
      setSaving(null);
    }
  };

  const selected = sessions.find((s) => s.id === choice);

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10">
      <p className="text-sm font-medium uppercase tracking-widest text-stone-500">
        Tonight&apos;s breakouts
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight">
        Which session will you join?
      </h1>
      <p className="mt-3 text-stone-600">
        Tap one. It helps us put each group in the right-sized room.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {sessions.map((s) => {
          const isChosen = choice === s.id;
          return (
            <button
              key={s.id}
              onClick={() => vote(s.id)}
              disabled={saving !== null}
              aria-pressed={isChosen}
              className={cn(
                "rounded-2xl border-2 bg-white p-5 text-left shadow-sm transition active:scale-[0.99]",
                isChosen ? "border-current" : "border-transparent",
              )}
              style={{ color: isChosen ? s.color : undefined }}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-xl font-semibold leading-snug text-stone-900">
                  {s.title}
                </h2>
                <span
                  className={cn(
                    "mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                    isChosen ? "border-current bg-current" : "border-stone-300",
                  )}
                >
                  {isChosen && (
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
              {saving === s.id && (
                <p className="mt-3 text-sm text-stone-500">Saving…</p>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 min-h-16 text-center" aria-live="polite">
        {error ? (
          <p className="text-red-700">
            Something went wrong. Please tap again.
          </p>
        ) : selected ? (
          <>
            <p className="font-serif text-2xl font-semibold">You&apos;re in!</p>
            <p className="mt-1 text-stone-600">
              See you at <strong>{selected.title}</strong>. Changed your mind?
              Just tap another session.
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
