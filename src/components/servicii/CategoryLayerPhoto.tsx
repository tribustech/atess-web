/**
 * CategoryLayerPhoto — renders the layer-photo asset for a service category.
 *
 * Server component (no "use client").
 *
 * When `photo.placeholder` is true the image is still rendered but a
 * "Imagine demonstrativă" badge is overlaid so reviewers know it is a
 * stand-in to be replaced before launch.
 */

import Image from "next/image";
import type { ServiceLayerPhoto } from "@/lib/services";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CategoryLayerPhotoProps {
  photo: ServiceLayerPhoto;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CategoryLayerPhoto({
  photo,
}: CategoryLayerPhotoProps): React.JSX.Element {
  return (
    <figure className="relative w-full overflow-hidden rounded-lg">
      <Image
        src={photo.src}
        alt={photo.alt}
        width={1200}
        height={800}
        className="w-full rounded-lg object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Placeholder badge — visible only while the real asset is pending */}
      {photo.placeholder && (
        <span
          aria-label="Imaginea este demonstrativă și va fi înlocuită"
          className="absolute right-3 top-3 rounded-full bg-amber-400/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-900 shadow-sm backdrop-blur-sm"
        >
          Imagine demonstrativă
        </span>
      )}

      {photo.caption && (
        <figcaption className="mt-2 text-xs text-text-muted">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}
