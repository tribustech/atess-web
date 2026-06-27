"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import type { GalleryEntry } from "@/lib/gallery";

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Placeholder entries: real width/height/blur arrive via gallery.json when
  // Teo's curated per-project folders are wired through projectSlug.
  const entries = useMemo<GalleryEntry[]>(
    () =>
      images.map((src, i) => ({
        id: `${title}-${i}`,
        src,
        thumb: src,
        width: 1600,
        height: 1200,
        blurDataURL: "",
        alt: `${title} — imagine ${i + 1}`,
        category: "piste-atletism",
      })),
    [images, title],
  );

  const numberById = useMemo(() => {
    const m = new Map<string, number>();
    entries.forEach((e, i) => m.set(e.id, i + 1));
    return m;
  }, [entries]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {entries.map((entry, i) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Mărește ${entry.alt}`}
            className="group relative aspect-[4/3] overflow-hidden bg-black/20"
          >
            <Image
              src={entry.src}
              alt={entry.alt}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
      <Lightbox
        entries={entries}
        index={openIndex}
        numberById={numberById}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
