"use client";

import { useMemo, useState } from "react";
import { FilterChips } from "./FilterChips";
import { GalleryItem } from "./GalleryItem";
import { Lightbox } from "./Lightbox";
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryEntry,
} from "@/lib/gallery";

type Filter = GalleryCategory | "toate";

interface GalleryGridProps {
  items: GalleryEntry[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [filter, setFilter] = useState<Filter>("toate");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "toate" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  const counts = useMemo<Record<Filter, number>>(() => {
    const c: Record<Filter, number> = { toate: items.length } as Record<Filter, number>;
    for (const cat of GALLERY_CATEGORIES) {
      c[cat.slug] = items.filter((i) => i.category === cat.slug).length;
    }
    return c;
  }, [items]);

  return (
    <>
      <FilterChips active={filter} onChange={setFilter} counts={counts} />
      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {filtered.map((entry, i) => (
          <GalleryItem key={entry.id} entry={entry} index={i} onOpen={setOpenIndex} />
        ))}
      </div>
      <Lightbox
        entries={filtered}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
