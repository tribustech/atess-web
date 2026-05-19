"use client";

import partnersData from "@/data/partners.json";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import { LogoNameBadge } from "./LogoNameBadge";

const clients = partnersData.filter((item) => item.type === "client").slice(0, 10);

const stats = [
  { label: "proiecte livrate", value: 500, suffix: "+" },
  { label: "judete acoperite", value: 40, suffix: "+" },
  { label: "ani experienta", value: 10, suffix: "+" },
];

export function ClientsSection() {
  const statA = useCountAnimation(stats[0].value);
  const statB = useCountAnimation(stats[1].value);
  const statC = useCountAnimation(stats[2].value);
  const values = [statA, statB, statC];

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 py-24 md:px-10">
      <p className="font-mono text-sm uppercase tracking-[0.18em] text-text-muted">
        E3
      </p>
      <h2 className="mt-3 text-display-lg">Lucrari care vorbesc</h2>
      <p className="mt-2 text-sm uppercase tracking-[0.14em] text-text-muted">
        Clienti de referinta
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        {clients.map((client) => (
          <div
            key={client.slug}
            className="flex h-20 items-center justify-start border border-border bg-bg-elevated px-3 text-center text-sm text-text-muted transition hover:text-text-primary"
          >
            <LogoNameBadge name={client.name} logo={client.logo} compact />
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="border border-border bg-bg-elevated p-6"
          >
            <p className="text-4xl font-semibold text-accent-primary">
              {values[idx]}
              {stat.suffix}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.12em] text-text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
