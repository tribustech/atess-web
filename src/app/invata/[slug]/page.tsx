import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  CATEGORY_META,
  LEVEL_LABEL,
} from "@/lib/academy";
import { ArticleRenderer } from "@/components/invata/ArticleRenderer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return {
      title: "Articol negăsit",
      robots: { index: false, follow: false },
    };
  }

  const url = `/invata/${article.slug}`;

  return {
    title: `${article.title} | Învață`,
    description: article.dek,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.dek,
      url,
      type: "article",
    },
  };
}

const AUDIENCE_LABEL: Record<string, string> = {
  arhitecti: "arhitecți",
  beneficiari: "beneficiari",
  antreprenori: "antreprenori",
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(slug, 3);
  const categoryMeta = CATEGORY_META[article.category];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.dek,
    url: `${SITE_URL}/invata/${article.slug}`,
    author: {
      "@type": "Person",
      name: "Teo Neagu",
      url: `${SITE_URL}/despre`,
    },
    publisher: {
      "@type": "Organization",
      name: "ATESS Project",
      url: SITE_URL,
    },
    keywords: article.tags.join(", "),
    articleSection: categoryMeta.label,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <main>
        <article>
          <header className="border-b border-border">
            <div className="mx-auto max-w-3xl px-6 pb-12 pt-32 md:pb-16 md:pt-40">
              <Link
                href="/invata"
                className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-accent-primary"
              >
                <ArrowLeft size={14} />
                Înapoi la Învață
              </Link>

              <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em]">
                <span className="font-mono text-accent-primary">
                  {categoryMeta.label}
                </span>
                <span className="h-px w-6 bg-border" />
                <span className="font-mono text-text-faint">
                  {LEVEL_LABEL[article.level]}
                </span>
                <span className="h-px w-6 bg-border" />
                <span className="inline-flex items-center gap-2 font-mono text-text-faint">
                  <Clock size={12} />
                  {article.readingMin} min
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                {article.title}
              </h1>

              <p className="mt-6 text-lg text-text-muted md:text-xl">
                {article.dek}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-sm">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint">
                    Autor
                  </p>
                  <p className="mt-1 text-text-primary">Teo Neagu</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint">
                    Pentru
                  </p>
                  <p className="mt-1 text-text-primary">
                    {article.audience
                      .map((a) => AUDIENCE_LABEL[a] ?? a)
                      .join(", ")}
                  </p>
                </div>
                {article.tags.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint">
                      Subiecte
                    </p>
                    <p className="mt-1 text-text-primary">
                      {article.tags.map((t) => `#${t}`).join(" ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <ArticleRenderer sections={article.sections} />
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-border bg-bg-elevated/30">
            <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
              <div className="mb-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
                  Citește în continuare
                </p>
                <h2 className="mt-3 text-2xl md:text-3xl">Articole conexe</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/invata/${rel.slug}`}
                    className="group flex flex-col border border-border bg-bg-base p-6 transition hover:border-accent-primary/60"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-primary">
                      {CATEGORY_META[rel.category].label}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold leading-tight text-text-primary transition-colors group-hover:text-accent-primary">
                      {rel.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm text-text-muted">
                      {rel.dek}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-text-faint">
                        {rel.readingMin} min
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="text-text-muted transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-primary"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
