import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getAllArticles,
  getArticlesGroupedByCategory,
} from "@/lib/academy";
import { ArticleCard } from "@/components/invata/ArticleCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

export const metadata: Metadata = {
  title: "Învață — Ghiduri tehnice pentru arhitecți și proiectanți",
  description:
    "Cum alegi corect pardoseala sportivă, cum citești o fișă tehnică, ce nu-ți spune marketingul. Conținut tehnic gratuit, scris de Teo Neagu, aplicator certificat cu 10+ ani pe șantier.",
  alternates: { canonical: "/invata" },
  openGraph: {
    title: "Învață — ATESS Project",
    description:
      "Ghiduri tehnice pentru arhitecți, proiectanți și beneficiari. Pardoseli sportive, locuri de joacă, interior — tot ce nu apare în fișele tehnice.",
    url: "/invata",
    type: "website",
  },
};

export default function InvataPage() {
  const all = getAllArticles();
  const featured = all.filter((a) => a.featured);
  const grouped = getArticlesGroupedByCategory();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Învață — ATESS Project",
    description:
      "Ghiduri tehnice pentru pardoseli sportive, locuri de joacă și interior.",
    url: `${SITE_URL}/invata`,
    blogPost: all.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.dek,
      url: `${SITE_URL}/invata/${a.slug}`,
      keywords: a.tags.join(", "),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-accent-primary" />
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
                Învață
              </p>
            </div>

            <h1 className="max-w-4xl text-display-lg">
              Ce nu apare
              <br />
              <span className="text-accent-primary">în fișa tehnică.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg text-text-muted md:text-xl">
              Ghiduri tehnice pentru arhitecți, proiectanți și beneficiari.
              Elaborate de Teo Neagu — peste 10 ani de experiență pe șantier,
              aplicator certificat Stockmeier — pe baza practicii reale, nu a
              materialelor de marketing.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span className="font-mono uppercase tracking-wider text-text-faint">
                {all.length} articole
              </span>
              <span className="h-1 w-1 rounded-full bg-text-faint" />
              <span className="font-mono uppercase tracking-wider text-text-faint">
                {grouped.length} secțiuni
              </span>
              <span className="h-1 w-1 rounded-full bg-text-faint" />
              <span className="font-mono uppercase tracking-wider text-text-faint">
                Lectură 4–7 min
              </span>
            </div>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="border-b border-border bg-bg-base">
            <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
              <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
                    Recomandate
                  </p>
                  <h2 className="mt-3 text-3xl md:text-4xl">
                    Articole esențiale
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    variant="featured"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {grouped.map((group) => (
          <section
            key={group.category}
            className="border-b border-border last:border-b-0"
          >
            <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
              <div className="mb-10 max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
                  {group.label}
                </p>
                <h2 className="mt-3 text-2xl md:text-3xl">{group.sub}</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="border-t border-accent-primary/20 bg-gradient-cta">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center md:px-10 md:py-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
              Aveți un proiect concret?
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl md:text-4xl">
              Articolele acoperă fundamentele. Pentru specific, discutăm direct.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-text-muted">
              Transmiteți-ne contextul proiectului — revenim cu o recomandare
              tehnică obiectivă, nu cu o ofertă comercială.
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-3 border border-accent-primary px-8 py-4 text-sm uppercase tracking-wider text-accent-primary transition hover:bg-accent-primary hover:text-text-primary"
            >
              Contactează-ne
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
