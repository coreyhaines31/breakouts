"use client";

import { useEffect, useState } from "react";
import { sessions } from "@/lib/sessions";
import { cn } from "@/lib/utils";

function Check({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition",
        on ? "border-accent bg-accent" : "border-hairline",
      )}
    >
      {on && (
        <svg viewBox="0 0 16 16" className="size-3.5 text-white">
          <path
            d="M3.5 8.5l3 3 6-6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
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
  const pendingSession = sessions.find((s) => s.id === pending);
  const confirmed = sessions.find((s) => s.id === choice);

  return (
    <main className="mx-auto w-full max-w-lg px-5 pt-14 pb-36">
      <h1 className="text-[30px] font-semibold sm:text-[34px] leading-tight tracking-tight">
        Choose your breakout.
      </h1>
      <p className="mt-2 text-[17px] text-muted">
        Select a session, then confirm.
      </p>

      {confirmed && !pending && (
        <div className="mt-8 rounded-2xl bg-white p-5" aria-live="polite">
          <p className="text-[17px] font-semibold">You&apos;re confirmed.</p>
          <p className="mt-1 text-[15px] leading-snug text-muted">
            {confirmed.title}. To switch, select another session.
          </p>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl bg-white">
        {sessions.map((s, i) => {
          const on = highlighted === s.id;
          return (
            <button
              key={s.id}
              id={`session-${s.id}`}
              onClick={() => select(s.id)}
              disabled={saving}
              aria-pressed={on}
              className={cn(
                "flex w-full scroll-mb-36 gap-4 p-5 text-left transition active:bg-black/[0.03]",
                i > 0 && "border-t border-hairline/70",
              )}
            >
              <div className="min-w-0 flex-1">
                <h2 className="text-[17px] font-semibold leading-snug">
                  {s.title}
                </h2>
                <p className="mt-0.5 text-[15px] text-muted">{s.leader}</p>
                <p className="mt-2 text-[15px] leading-snug text-muted">
                  {s.description}
                </p>
              </div>
              <Check on={on} />
            </button>
          );
        })}
      </div>

      {pendingSession && (
        <div className="fixed inset-x-0 bottom-0 border-t border-hairline/70 bg-background/85 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
          <div className="mx-auto max-w-lg">
            <p className="truncate text-center text-[13px] text-muted">
              {error
                ? "Couldn't save. Check your connection and try again."
                : pendingSession.title}
            </p>
            <div className="mt-2.5 flex gap-2">
              <button
                onClick={() => setPending(null)}
                disabled={saving}
                className="rounded-full px-5 py-3 text-[17px] text-accent active:bg-black/[0.04]"
              >
                Cancel
              </button>
              <button
                onClick={confirm}
                disabled={saving}
                className="flex-1 rounded-full bg-accent py-3 text-[17px] font-medium text-white transition active:opacity-80 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
