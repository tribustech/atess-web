import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Map } from "lucide-react";
import galleryRaw from "@/data/gallery.json";
import {
  assertAllAltsFilled,
  buildImageGalleryJsonLd,
  type GalleryEntry,
} from "@/lib/gallery";
import { getProjectsGroupedByCategory, resolveCategorieParam } from "@/lib/projects";
import { ProjectsExplorer } from "@/components/proiecte/ProjectsExplorer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

const gallery = galleryRaw as GalleryEntry[];
assertAllAltsFilled(gallery);
const featured = gallery.find((g) => g.featured) ?? gallery[0];

function loadMapSvg(): string {
  return readFileSync(join(process.cwd(), "src/data/RomaniaMap.svg"), "utf8");
}

export const metadata: Metadata = {
  title: "Proiecte realizate | Atess Professional Flooring",
  description:
    "Proiecte de pardoseli sportive, piste de atletism, terenuri multisport și spații educaționale realizate de echipa Atess în toată România.",
  alternates: { canonical: "/proiecte" },
  openGraph: {
    title: "Proiecte realizate — Atess Professional Flooring",
    description:
      "Portofoliu organizat pe categorii: piste de atletism, multisport, spații educaționale, spații publice și pardoseli interioare.",
    url: "/proiecte",
    type: "website",
    images: featured
      ? [{ url: featured.src, width: featured.width, height: featured.height, alt: featured.alt }]
      : undefined,
  },
};

interface PageProps {
  searchParams: Promise<{ categorie?: string }>;
}

export default async function ProiectePage({ searchParams }: PageProps) {
  const { categorie } = await searchParams;
  const initialCategory = resolveCategorieParam(categorie);
  const groups = getProjectsGroupedByCategory();
  const jsonLd = buildImageGalleryJsonLd(gallery, SITE_URL);
  const svgMarkup = loadMapSvg();

  return (
    <div className="mx-auto max-w-[88rem] px-6 pb-24 pt-32">
      <header className="mb-12 max-w-3xl">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-primary">
          Portofoliu
        </p>
        <h1 className="mt-3 text-display-lg">Proiecte realizate</h1>
        <p className="mt-4 text-text-muted">
          Proiecte de pardoseli sportive, piste de atletism, terenuri multisport
          și spații educaționale, organizate pe categorii și documentate proiect
          cu proiect.
        </p>
        <Link
          href="/proiecte/harta"
          className="mt-6 inline-flex h-11 items-center gap-2 border border-accent-primary px-5 text-sm uppercase tracking-wider text-accent-primary transition hover:bg-accent-primary hover:text-text-primary lg:hidden"
        >
          <Map size={16} />
          Explorează pe hartă
        </Link>
      </header>

      <Suspense fallback={<div className="h-96 animate-pulse rounded bg-bg-elevated/30" />}>
        <ProjectsExplorer
          groups={groups}
          initialCategory={initialCategory}
          svgMarkup={svgMarkup}
        />
      </Suspense>

      <section className="mt-24 border-t border-accent-primary/20 pt-12">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-text-muted">
            Aveți un proiect similar în plan? Descrieți-l pe scurt și revenim cu o
            propunere personalizată.
          </p>
          <a
            href="/contact"
            className="inline-flex h-12 items-center border border-accent-primary px-6 text-sm uppercase tracking-wider text-accent-primary transition hover:bg-accent-primary hover:text-text-primary"
          >
            Contactează echipa
          </a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
