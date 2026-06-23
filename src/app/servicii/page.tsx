import type { Metadata } from "next";
import Link from "next/link";
import { getCategoriesByAxis, AXIS_LABEL } from "@/lib/services";
import type { ServiceAxis } from "@/lib/services";
import { ServiceCategoryCard } from "@/components/servicii/ServiceCategoryCard";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Servicii — pardoseli profesionale interioare și exterioare",
  description:
    "Pardoseli sportive, locuri de joacă, PVC, linoleum, LVT și mochetă. Servicii complete de la proiectare la execuție.",
  alternates: { canonical: "/servicii" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AXES: ServiceAxis[] = ["exterior", "interior"];

export default function ServiciiPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      {/* Page header */}
      <header className="mb-16 max-w-3xl">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-primary">
          Ce executăm
        </p>
        <h1 className="mt-3 text-display-lg">Servicii</h1>
        <p className="mt-4 text-text-muted">
          Construim și aplicăm pardoseli profesionale pentru interior și
          exterior — de la suprafețe sportive omologate la soluții decorative și
          comerciale. Fiecare proiect este tratat ca un serviciu complet:
          consultanță, proiectare, execuție și garanție.
        </p>
      </header>

      {/* Exterior + Interior sections */}
      {AXES.map((axis) => {
        const categories = getCategoriesByAxis(axis);
        return (
          <section key={axis} id={axis} className="mb-20 scroll-mt-28">
            <h2 className="mb-8 text-2xl font-semibold text-text-primary">
              {AXIS_LABEL[axis]}
            </h2>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <ServiceCategoryCard category={cat} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {/* Cross-link row */}
      <section className="mt-8 border-t border-accent-primary/20 pt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-text-muted">
            Vrei să vezi lucrări deja finalizate sau să configurezi un proiect
            nou?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/proiecte"
              className="inline-flex h-12 items-center border border-accent-primary px-6 text-sm uppercase tracking-wider text-accent-primary transition hover:bg-accent-primary hover:text-text-primary"
            >
              Vezi proiectele realizate
            </Link>
            <Link
              href="/configurator"
              className="inline-flex h-12 items-center border border-white/20 px-6 text-sm uppercase tracking-wider text-text-muted transition hover:border-accent-primary hover:text-accent-primary"
            >
              Configurează-ți proiectul
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
