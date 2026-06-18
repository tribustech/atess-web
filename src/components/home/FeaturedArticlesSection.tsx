import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface FeaturedArticlesSectionProps {
  articles: { slug: string; title: string; dek: string; readingMin: number }[];
}

export function FeaturedArticlesSection({ articles }: FeaturedArticlesSectionProps) {
  if (articles.length === 0) return null;

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 py-24 md:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-display-lg">Învață</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.14em] text-text-muted">
            Ghiduri tehnice și criterii de decizie
          </p>
        </div>
        <Link
          href="/invata"
          className="hidden shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-primary transition hover:gap-3 sm:inline-flex"
        >
          Toate articolele
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ul className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
        {articles.map((article) => (
          <li key={article.slug} className="bg-bg-elevated">
            <Link
              href={`/invata/${article.slug}`}
              className="group flex h-full flex-col justify-between gap-6 p-7 transition-colors hover:bg-white"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  {article.readingMin} min de citit
                </p>
                <h3 className="mt-3 text-xl font-semibold text-text-primary">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm text-text-muted">{article.dek}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-primary transition group-hover:gap-2.5">
                Citește
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/invata"
        className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-primary transition hover:gap-3 sm:hidden"
      >
        Toate articolele
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
