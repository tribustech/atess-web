/**
 * ServiceCategoryCard — card linking to a single service category page.
 *
 * Server component (no "use client").
 * Used in the Servicii index page to render the Exterior / Interior grids.
 */

import Link from "next/link";
import Image from "next/image";
import type { ServiceCategory } from "@/lib/services";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServiceCategoryCardProps {
  category: ServiceCategory;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ServiceCategoryCard({
  category,
}: ServiceCategoryCardProps): React.JSX.Element {
  return (
    <Link
      href={`/servicii/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-neutral-900 transition hover:border-accent-primary/50 hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <Image
          src={category.layerPhoto.src}
          alt=""
          width={480}
          height={320}
          className="aspect-[3/2] w-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Placeholder badge */}
        {category.layerPhoto.placeholder && (
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-900 backdrop-blur-sm"
          >
            Demo
          </span>
        )}

        {/* Sport tag */}
        {category.isSport && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-green/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-900 backdrop-blur-sm">
            Sportiv
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mt-3 text-lg font-medium text-text-primary">
          {category.label}
        </h3>
        <p className="mt-1 text-sm text-text-muted">{category.shortBlurb}</p>
      </div>
    </Link>
  );
}
