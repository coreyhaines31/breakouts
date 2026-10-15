"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { sessions } from "@/lib/sessions";
import { useCounts } from "@/components/use-counts";

export default function SlidePage() {
  const [qr, setQr] = useState({ svg: "", url: "" });
  const counts = useCounts(3000);
  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;

  useEffect(() => {
    const target = window.location.origin;
    QRCode.toString(target, {
      type: "svg",
      margin: 0,
      errorCorrectionLevel: "M",
      color: { dark: "#1c1917", light: "#ffffff" },
    }).then((svg) =>
      setQr({ svg, url: target.replace(/^https?:\/\//, "") }),
    );
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-[4vmin]">
      <div className="grid w-full max-w-[1600px] grid-cols-1 items-center gap-[6vmin] md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-[2.2vmin] font-medium uppercase tracking-[0.2em] text-stone-500">
            Tonight&apos;s breakouts
          </p>
          <h1 className="mt-[1.5vmin] font-serif text-[7vmin] font-semibold leading-[1.05]">
            Scan to pick your session
          </h1>
          <ul className="mt-[5vmin] flex flex-col gap-[3vmin]">
            {sessions.map((s) => (
              <li key={s.id} className="flex gap-[2vmin]">
                <span
                  className="mt-[0.6vmin] w-[0.8vmin] shrink-0 rounded-full"
                  style={{ background: s.color }}
                />
                <div>
                  <p className="font-serif text-[3.4vmin] font-semibold leading-tight">
                    {s.title}
                  </p>
                  <p className="text-[2.4vmin] text-stone-600">
                    Led by {s.leader}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-[3vmin] bg-white p-[3vmin] shadow-xl">
            <div
              className="size-[52vmin] [&>svg]:size-full"
              dangerouslySetInnerHTML={{ __html: qr.svg }}
            />
          </div>
          <p className="mt-[2.5vmin] text-[2.8vmin] font-semibold">{qr.url}</p>
          <p className="mt-[0.5vmin] text-[2.2vmin] text-stone-500">
            {total} {total === 1 ? "response" : "responses"} so far
          </p>
        </div>
      </div>
    </main>
  );
}
