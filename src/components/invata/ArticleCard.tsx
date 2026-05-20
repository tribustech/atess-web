import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AcademyArticle } from "@/lib/academy";
import { LEVEL_LABEL } from "@/lib/academy";

interface ArticleCardProps {
  article: AcademyArticle;
  variant?: "default" | "featured";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/invata/${article.slug}`}
      className={[
        "group relative flex flex-col border border-border bg-bg-elevated/40 p-6 transition",
        "hover:border-accent-primary/60 hover:bg-bg-elevated",
        isFeatured ? "md:p-8" : "",
      ].join(" ")}
    >
      <div className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]">
        <span className="font-mono text-accent-primary">
          {LEVEL_LABEL[article.level]}
        </span>
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-text-faint">
          {article.readingMin} min
        </span>
      </div>

      <h3
        className={[
          "font-semibold leading-tight text-text-primary transition-colors group-hover:text-accent-primary",
          isFeatured ? "text-2xl md:text-3xl" : "text-xl",
        ].join(" ")}
      >
        {article.title}
      </h3>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">
        {article.dek}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-wider text-text-faint"
            >
              #{tag}
            </span>
          ))}
        </div>
        <ArrowUpRight
          size={18}
          className="text-text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent-primary"
        />
      </div>
    </Link>
  );
}
