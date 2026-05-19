"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { GalleryEntry } from "@/lib/gallery";

interface GalleryItemProps {
  entry: GalleryEntry;
  index: number;
  onOpen: (index: number) => void;
}

export function GalleryItem({ entry, index, onOpen }: GalleryItemProps) {
  const reduce = useReducedMotion();

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
        aria-label={`Mărește imaginea: ${entry.caption ?? entry.alt}`}
        className="group block w-full overflow-hidden bg-black/20 text-left"
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
        {entry.caption ? (
          <figcaption className="mt-2 text-sm text-text-muted">
            {entry.caption}
          </figcaption>
        ) : null}
      </button>
    </motion.figure>
  );
}
