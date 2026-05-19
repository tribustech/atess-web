"use client";

import { GALLERY_CATEGORIES, type GalleryCategory } from "@/lib/gallery";
import { cn } from "@/lib/utils/cn";

type Filter = GalleryCategory | "toate";

interface FilterChipsProps {
  active: Filter;
  onChange: (next: Filter) => void;
  counts: Record<Filter, number>;
}

const ALL: { slug: Filter; label: string } = { slug: "toate", label: "Toate" };

export function FilterChips({ active, onChange, counts }: FilterChipsProps) {
  const options: { slug: Filter; label: string }[] = [ALL, ...GALLERY_CATEGORIES];

  return (
    <div
      role="tablist"
      aria-label="Filtrează proiecte după categorie"
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const isActive = opt.slug === active;
        return (
          <button
            key={opt.slug}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.slug)}
            className={cn(
              "inline-flex h-10 items-center border px-4 text-sm uppercase tracking-wider transition",
              isActive
                ? "border-accent-primary bg-accent-primary text-text-primary"
                : "border-accent-primary/30 text-text-muted hover:border-accent-primary hover:text-text-primary",
            )}
          >
            {opt.label}
            <span className="ml-2 text-xs opacity-60">({counts[opt.slug] ?? 0})</span>
          </button>
        );
      })}
    </div>
  );
}
