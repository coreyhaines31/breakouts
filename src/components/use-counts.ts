"use client";

import { useEffect, useState } from "react";
import type { Counts } from "@/lib/sessions";

export function useCounts(intervalMs = 2000) {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/results", { cache: "no-store" });
        const data = await res.json();
        if (active) setCounts(data.counts);
      } catch {}
    };
    load();
    const id = setInterval(load, intervalMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [intervalMs]);

  return counts;
}
