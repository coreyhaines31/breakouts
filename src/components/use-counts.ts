"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Counts } from "@/lib/sessions";

export function useCounts(intervalMs = 2000) {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [stale, setStale] = useState(false);
  const inFlight = useRef(false);
  const lastOk = useRef(0);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch("/api/results", {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCounts(data.counts);
      lastOk.current = Date.now();
      setStale(false);
    } catch {
      if (Date.now() - lastOk.current > intervalMs * 3) setStale(true);
    } finally {
      inFlight.current = false;
    }
  }, [intervalMs]);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const id = setInterval(load, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [load, intervalMs]);

  return { counts, stale, refresh: load };
}
