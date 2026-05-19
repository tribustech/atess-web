"use client";

import { useEffect, useState } from "react";

export function useCountAnimation(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let rafId = 0;

    const frame = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);

  return value;
}
