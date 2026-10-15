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
    <main className="flex min-h-screen items-center justify-center bg-white p-[5vmin]">
      <div className="grid w-full max-w-[1600px] grid-cols-1 items-center gap-[8vmin] md:grid-cols-[1fr_auto]">
        <div>
          <h1 className="text-[7.5vmin] font-semibold leading-[1.05] tracking-tight">
            Choose your breakout.
          </h1>
          <p className="mt-[1.5vmin] text-[3vmin] text-muted">
            Scan the code with your phone camera.
          </p>
          <ul className="mt-[6vmin] flex flex-col gap-[3.5vmin]">
            {sessions.map((s) => (
              <li key={s.id}>
                <p className="text-[3.2vmin] font-semibold leading-tight">
                  {s.title}
                </p>
                <p className="mt-[0.4vmin] text-[2.4vmin] text-muted">
                  {s.leader}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="size-[50vmin] [&>svg]:size-full"
            dangerouslySetInnerHTML={{ __html: qr.svg }}
          />
          <p className="mt-[3vmin] text-[2.8vmin] font-medium">{qr.url}</p>
          <p className="mt-[0.5vmin] text-[2.2vmin] text-muted tabular-nums">
            {total} {total === 1 ? "response" : "responses"}
          </p>
        </div>
      </div>
    </main>
  );
}
