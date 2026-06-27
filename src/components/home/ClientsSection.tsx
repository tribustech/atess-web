"use client";

import partnersData from "@/data/partners.json";
import { useCountAnimation } from "@/hooks/useCountAnimation";

const clients = partnersData.filter((item) => item.type === "client");

// Split the logos across two rows that drift in opposite directions.
const half = Math.ceil(clients.length / 2);
const rowTop = clients.slice(0, half);
const rowBottom = clients.slice(half);

const stats = [
  { label: "proiecte livrate", value: 500, suffix: "+" },
  { label: "judete acoperite", value: 40, suffix: "+" },
  { label: "ani experienta", value: 10, suffix: "+" },
];

type Client = (typeof clients)[number];

function MarqueeRow({
  items,
  reverse = false,
  duration,
}: {
  items: Client[];
  reverse?: boolean;
  duration: number;
}) {
  // Duplicate the set so translateX(-50%) loops seamlessly.
  const track = [...items, ...items];

  return (
    <div className="group flex overflow-hidden">
      <ul
        className="flex shrink-0 gap-px pr-px motion-reduce:!animate-none group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track.map((client, i) => (
          <li
            key={`${client.slug}-${i}`}
            aria-hidden={i >= items.length}
            className="group/tile relative flex aspect-[3/2] w-56 shrink-0 items-center justify-center overflow-hidden bg-[#F5F5F3] p-6 transition-colors duration-300 hover:bg-white sm:w-72 sm:p-8 lg:w-80 xl:w-[22rem]"
            title={client.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.logo}
              alt={`${client.name} logo`}
              className="max-h-[70%] max-w-[82%] object-contain transition-transform duration-500 ease-out group-hover/tile:scale-[1.04]"
              loading="lazy"
              decoding="async"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-3 translate-y-1 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-text-faint opacity-0 transition-all duration-300 group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
              {client.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ClientsSection() {
  const statA = useCountAnimation(stats[0].value);
  const statB = useCountAnimation(stats[1].value);
  const statC = useCountAnimation(stats[2].value);
  const values = [statA, statB, statC];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-20 md:px-10 md:py-28">
      <h2 className="text-display-lg">Lucrari care vorbesc</h2>
      <p className="mt-2 text-sm uppercase tracking-[0.14em] text-text-muted">
        Clienti de referinta
      </p>

      {/* Full-bleed two-row carousel that drifts off both edges of the screen */}
      <div
        className="relative left-1/2 mt-10 w-screen -translate-x-1/2 space-y-px overflow-hidden bg-border py-px"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <MarqueeRow items={rowTop} duration={48} />
        <MarqueeRow items={rowBottom} duration={56} reverse />
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
