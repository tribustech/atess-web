"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { GalleryEntry } from "@/lib/gallery";

interface GalleryItemProps {
  entry: GalleryEntry;
  index: number;
  displayNumber: number;
  onOpen: (index: number) => void;
}

export function GalleryItem({ entry, index, displayNumber, onOpen }: GalleryItemProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: reduce ? 0 : Math.min(index * 0.04, 0.4) }}
      className="mb-4 break-inside-avoid"
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Mărește imaginea ${displayNumber}: ${entry.caption ?? entry.alt}`}
        className="group relative block w-full overflow-hidden bg-black/20 text-left"
      >
        <Image
          src={entry.thumb}
          alt={entry.alt}
          width={entry.width}
          height={entry.height}
          placeholder="blur"
          blurDataURL={entry.blurDataURL}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={index < 6}
          className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-2 grid h-7 min-w-[1.75rem] place-items-center rounded-full bg-black/75 px-2 font-mono text-xs font-semibold text-white shadow-sm"
        >
          #{displayNumber}
        </span>
      </button>
      {entry.caption ? (
        <figcaption className="mt-2 text-sm text-text-muted">
          {entry.caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}
