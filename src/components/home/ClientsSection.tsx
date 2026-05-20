"use client";

import partnersData from "@/data/partners.json";
import { useCountAnimation } from "@/hooks/useCountAnimation";

const clients = partnersData.filter((item) => item.type === "client");

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
      <h2 className="text-display-lg">Lucrari care vorbesc</h2>
      <p className="mt-2 text-sm uppercase tracking-[0.14em] text-text-muted">
        Clienti de referinta
      </p>

      <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-3 lg:grid-cols-4">
        {clients.map((client) => (
          <li
            key={client.slug}
            className="group relative flex aspect-[3/2] items-center justify-center overflow-hidden bg-[#F5F5F3] p-6 transition-colors duration-300 hover:bg-white sm:p-8"
            title={client.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.logo}
              alt={`${client.name} logo`}
              className="max-h-[68%] max-w-[80%] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-3 translate-y-1 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-text-faint opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {client.name}
            </span>
          </li>
        ))}
      </ul>

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
