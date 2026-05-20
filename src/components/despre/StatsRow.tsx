"use client";

import { useCountAnimation } from "@/hooks/useCountAnimation";

const STATS = [
  { label: "proiecte livrate", value: 500, suffix: "+" },
  { label: "județe acoperite", value: 40, suffix: "+" },
  { label: "ani de experiență", value: 10, suffix: "+" },
];

export function StatsRow() {
  const a = useCountAnimation(STATS[0].value);
  const b = useCountAnimation(STATS[1].value);
  const c = useCountAnimation(STATS[2].value);
  const values = [a, b, c];

  return (
    <section className="bg-bg-base">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-4 md:grid-cols-3">
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="border border-border bg-bg-elevated p-8"
            >
              <p className="text-5xl font-semibold text-accent-primary md:text-6xl">
                {values[idx]}
                {stat.suffix}
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
