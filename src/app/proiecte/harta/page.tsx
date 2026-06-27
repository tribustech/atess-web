import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ArrowLeft } from "lucide-react";
import { RomaniaMap } from "@/components/proiecte/RomaniaMap";

export const metadata: Metadata = {
  title: "Hartă proiecte | Atess Professional Flooring",
  description:
    "Explorați proiectele Atess pe harta României. Selectați un județ pentru a vedea lucrările realizate în zona respectivă.",
  alternates: { canonical: "/proiecte/harta" },
};

function loadSvg(): string {
  return readFileSync(
    join(process.cwd(), "src/data/RomaniaMap.svg"),
    "utf8",
  );
}

export default function HartaPage() {
  const svgMarkup = loadSvg();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <Link
        href="/proiecte"
        className="inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-text-primary"
      >
        <ArrowLeft size={14} /> Înapoi la proiecte
      </Link>

      <header className="mt-6 mb-12 max-w-3xl">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-primary">
          Hartă
        </p>
        <h1 className="mt-3 text-display-lg">Proiecte pe harta României</h1>
        <p className="mt-4 text-text-muted">
          Selectați un județ pentru a vedea proiectele realizate în zona
          respectivă. Vizualizarea va fi extinsă pe măsură ce documentăm
          întregul portofoliu.
        </p>
      </header>

      <RomaniaMap svgMarkup={svgMarkup} />
    </div>
  );
}
