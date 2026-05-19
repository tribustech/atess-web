import partnersData from "@/data/partners.json";
import { LogoNameBadge } from "./LogoNameBadge";

const manufacturers = partnersData.filter((item) => item.type === "manufacturer");

export function PartnersSection() {
  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 py-24 md:px-10">
      <p className="font-mono text-sm uppercase tracking-[0.18em] text-text-muted">
        E2
      </p>
      <h2 className="mt-3 text-display-lg">Parteneri strategici</h2>
      <p className="mt-2 text-sm uppercase tracking-[0.14em] text-accent-primary">
        Stockmeier (partener certificat)
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {manufacturers.map((partner) => (
          <a
            key={partner.slug}
            href={partner.url}
            target="_blank"
            rel="noreferrer"
            className="group border border-border bg-bg-elevated p-8 transition hover:border-accent-primary"
          >
            <LogoNameBadge name={partner.name} logo={partner.logo} />
            <p className="mt-3 text-text-muted">{partner.description}</p>
            <p className="mt-6 text-sm uppercase tracking-[0.12em] text-accent-primary">
              Detalii sisteme
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
