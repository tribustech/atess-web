import type { Metadata } from "next";
import galleryRaw from "@/data/gallery.json";
import {
  assertAllAltsFilled,
  buildImageGalleryJsonLd,
  type GalleryEntry,
} from "@/lib/gallery";
import { GalleryGrid } from "@/components/proiecte/GalleryGrid";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

const gallery = galleryRaw as GalleryEntry[];
assertAllAltsFilled(gallery);

const featured = gallery.find((g) => g.featured) ?? gallery[0];

export const metadata: Metadata = {
  title: "Proiecte realizate | Atess Professional Flooring",
  description:
    "Galerie cu lucrări de pardoseli sportive, piste de atletism, terenuri multisport și locuri de joacă realizate de echipa Atess în toată România.",
  alternates: { canonical: "/proiecte" },
  openGraph: {
    title: "Proiecte realizate — Atess Professional Flooring",
    description:
      "Galerie cu pardoseli sportive aplicate de Atess: piste atletism, multisport, locuri de joacă, spații educaționale.",
    url: "/proiecte",
    type: "website",
    images: featured
      ? [
          {
            url: featured.src,
            width: featured.width,
            height: featured.height,
            alt: featured.alt,
          },
        ]
      : undefined,
  },
};

export default function ProiectePage() {
  const jsonLd = buildImageGalleryJsonLd(gallery, SITE_URL);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <header className="mb-12 max-w-3xl">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-primary">
          Portofoliu
        </p>
        <h1 className="mt-3 text-display-lg">Proiecte realizate</h1>
        <p className="mt-4 text-text-muted">
          Lucrări de pardoseli sportive, piste de atletism, terenuri multisport și
          locuri de joacă aplicate de echipa Atess în toată România.
        </p>
      </header>

      <GalleryGrid items={gallery} />

      <section className="mt-24 border-t border-accent-primary/20 pt-12">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-text-muted">
            Vrei un proiect similar? Spune-ne ce ai în plan și revenim cu o ofertă
            personalizată.
          </p>
          <a
            href="/contact"
            className="inline-flex h-12 items-center border border-accent-primary px-6 text-sm uppercase tracking-wider text-accent-primary transition hover:bg-accent-primary hover:text-text-primary"
          >
            Contactează-ne
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
