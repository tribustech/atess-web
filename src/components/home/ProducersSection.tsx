import { ArrowUpRight } from "lucide-react";
import { getManufacturers, getLeadManufacturer } from "@/lib/partners";

export function ProducersSection() {
  const lead = getLeadManufacturer();
  const rest = getManufacturers().filter((m) => m.slug !== lead.slug);

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 py-24 md:px-10">
      <h2 className="text-display-lg">Producători pe care îi distribuim</h2>
      <p className="mt-2 text-sm uppercase tracking-[0.14em] text-text-muted">
        Distribuitori autorizați pentru sisteme sportive și de interior
      </p>

      <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
        <a
          href={lead.url}
          target="_blank"
          rel="noreferrer"
          className="group relative flex flex-col justify-between gap-8 bg-bg-elevated p-8 transition-colors hover:bg-white lg:col-span-2 lg:row-span-2 lg:p-12"
        >
          <div className="flex items-start justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lead.logo}
              alt={`${lead.name} logo`}
              className="h-16 w-auto max-w-[280px] object-contain md:h-24"
              loading="lazy"
              decoding="async"
            />
            <ArrowUpRight className="h-6 w-6 text-text-muted transition group-hover:text-accent-primary" />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-primary">
              Partener principal
            </p>
            <p className="mt-3 max-w-xl text-lg text-text-muted md:text-xl">
              {lead.description}
            </p>
          </div>
        </a>

        {rest.map((m) => (
          <a
            key={m.slug}
            href={m.url}
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col justify-between gap-6 bg-bg-elevated p-6 transition-colors hover:bg-white"
          >
            <div className="flex items-start justify-between">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.logo}
                alt={`${m.name} logo`}
                className="h-9 w-auto max-w-[160px] object-contain"
                loading="lazy"
                decoding="async"
              />
              <ArrowUpRight className="h-4 w-4 text-text-muted transition group-hover:text-accent-primary" />
            </div>
            <p className="text-sm text-text-muted">{m.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
