"use client";

/**
 * ServicesMegaMenu — full-width mega-panel shown when hovering "Servicii".
 *
 * Layout (Nike-style featured pattern, validated by NN/g + Baymard research):
 *   - LEFT: two axis groups (Exterior / Interior) with strong headings; each
 *     category is a link with its subcategories listed beneath. 3 visual
 *     columns total (2 axis link-columns + 1 featured) stays within the
 *     "3–4 column sweet spot" that avoids choice overload.
 *   - RIGHT: a single featured image panel that updates to the category the
 *     user is hovering — one image instead of eight, which keeps the panel
 *     light and premium while still being visual.
 *
 * Positioning (full-width, fixed under the header) is owned by Header.tsx;
 * this file owns only the visual bar + content.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  getCategoriesByAxis,
  getCategory,
  AXIS_LABEL,
  type ServiceCategory,
  type ServiceAxis,
} from "@/lib/services";
import { getMegaMenuImage } from "@/lib/megaMenuImages";
import { getServiceSubcategories } from "@/lib/serviceSubcategories";

export interface ServicesMegaMenuProps {
  /** Called when a link is clicked — the Header uses this to close the panel. */
  onNavigate?: () => void;
}

const AXES: ServiceAxis[] = ["exterior", "interior"];
const DEFAULT_FEATURED = "sport-outdoor";

// ─── Axis block (left) ────────────────────────────────────────────────────────

function AxisBlock({
  axis,
  onHoverCategory,
  onNavigate,
}: {
  axis: ServiceAxis;
  onHoverCategory: (slug: string) => void;
  onNavigate?: () => void;
}) {
  const categories = getCategoriesByAxis(axis);
  return (
    <section>
      {/* Group label — distinct mono/accent eyebrow (NOT a category link) + rule */}
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-accent-primary">
          {AXIS_LABEL[axis]}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-5">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            onMouseEnter={() => onHoverCategory(cat.slug)}
            onFocus={() => onHoverCategory(cat.slug)}
          >
            <Link
              href={`/servicii/${cat.slug}`}
              onClick={onNavigate}
              className={cn(
                "inline-block rounded text-base font-semibold text-text-primary transition-colors hover:text-accent-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
              )}
            >
              {cat.label}
            </Link>
            <ul className="mt-1.5 flex flex-wrap gap-x-3.5 gap-y-1">
              {getServiceSubcategories(cat.slug).map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/servicii/${cat.slug}#${sub.id}`}
                    onClick={onNavigate}
                    className={cn(
                      "rounded text-[13px] text-text-muted transition-colors hover:text-accent-primary",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary",
                    )}
                  >
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Featured panel (right) ───────────────────────────────────────────────────

function FeaturedPanel({
  category,
  onNavigate,
}: {
  category: ServiceCategory;
  onNavigate?: () => void;
}) {
  const photo = getMegaMenuImage(category.slug);
  return (
    <Link
      href={`/servicii/${category.slug}`}
      onClick={onNavigate}
      className={cn(
        "group relative block min-h-[300px] overflow-hidden rounded-xl bg-neutral-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
      )}
    >
      <Image
        key={photo.src}
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="360px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-primary">
          {category.group}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold text-white">
          {category.label}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/75">
          {category.shortBlurb}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
          Descoperă
          <ArrowUpRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ServicesMegaMenu({ onNavigate }: ServicesMegaMenuProps) {
  const [featuredSlug, setFeaturedSlug] = useState<string>(DEFAULT_FEATURED);
  const featured = getCategory(featuredSlug) ?? getCategory(DEFAULT_FEATURED)!;

  return (
    <div
      id="servicii-mega-menu"
      role="region"
      aria-label="Meniu servicii"
      className="w-full border-b border-border bg-bg-base/95 backdrop-blur-md shadow-2xl"
    >
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          {/* Left: two axis link-columns */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-2">
            {AXES.map((axis) => (
              <AxisBlock
                key={axis}
                axis={axis}
                onHoverCategory={setFeaturedSlug}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          {/* Right: single featured image that follows the hovered category */}
          <FeaturedPanel category={featured} onNavigate={onNavigate} />
        </div>

        {/* Footer cross-links */}
        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-5">
          <Link
            href="/servicii"
            onClick={onNavigate}
            className={cn(
              "group/link inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-text-primary",
              "transition-colors hover:text-accent-primary",
              "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
            )}
          >
            Toate serviciile
            <ArrowUpRight
              size={14}
              className="opacity-60 transition-opacity group-hover/link:opacity-100"
            />
          </Link>
          <Link
            href="/proiecte"
            onClick={onNavigate}
            className={cn(
              "group/link inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-text-primary",
              "transition-colors hover:text-accent-primary",
              "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
            )}
          >
            Vezi proiecte
            <ArrowUpRight
              size={14}
              className="opacity-60 transition-opacity group-hover/link:opacity-100"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServicesMegaMenu;
