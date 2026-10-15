"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { sessions } from "@/lib/sessions";
import { useCounts } from "@/components/use-counts";

export default function SlidePage() {
  const [qr, setQr] = useState({ svg: "", url: "" });
  const { counts } = useCounts(3000);
  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;

  useEffect(() => {
    const target = window.location.origin;
    QRCode.toString(target, {
      type: "svg",
      margin: 0,
      errorCorrectionLevel: "M",
      color: { dark: "#1d1d1f", light: "#ffffff" },
    }).then((svg) =>
      setQr({ svg, url: target.replace(/^https?:\/\//, "") }),
    );
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-[5vmin]">
      <div className="grid w-full max-w-[1600px] grid-cols-1 items-center gap-[7vmin] md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-[2.2vmin] font-semibold uppercase tracking-[0.12em] text-muted">
            Tonight&apos;s breakouts
          </p>
          <h1 className="mt-[1.2vmin] text-[8vmin] font-bold leading-[1.02] tracking-[-0.03em]">
            Choose your
            <br />
            breakout.
          </h1>
          <ul className="mt-[5vmin] flex flex-col gap-[1.8vmin]">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="glass rounded-[2.4vmin] px-[2.6vmin] py-[2vmin]"
              >
                <p className="text-[2.9vmin] font-semibold leading-tight tracking-[-0.01em]">
                  {s.title}
                </p>
                <p className="mt-[0.4vmin] text-[2.2vmin] font-medium text-accent">
                  {s.leader}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass flex flex-col items-center rounded-[4.5vmin] p-[3.5vmin]">
          <div className="rounded-[2.5vmin] bg-white p-[2.5vmin]">
            <div
              className="size-[44vmin] [&>svg]:size-full"
              dangerouslySetInnerHTML={{ __html: qr.svg }}
            />
          </div>
          <p className="mt-[2.5vmin] text-[2.6vmin] font-semibold tracking-[-0.01em]">
            Scan with your phone camera
          </p>
          <p className="mt-[0.4vmin] text-[2.2vmin] text-muted">
            or visit {qr.url}
          </p>
          <p className="mt-[1.8vmin] rounded-full bg-white/60 px-[1.8vmin] py-[0.6vmin] text-[1.9vmin] font-medium text-muted tabular-nums">
            {total} {total === 1 ? "response" : "responses"}
          </p>
        </div>
      </div>
    </main>
  );
}
