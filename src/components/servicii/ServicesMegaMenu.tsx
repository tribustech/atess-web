"use client";

/**
 * ServicesMegaMenu — mega-panel shown when hovering "Servicii" in the Header.
 *
 * Renders two columns (Exterior / Interior) with all service categories.
 * Each category is a link to /servicii/[slug] with a label, shortBlurb, and
 * a 3-D (or photo/icon fallback) preview via CategoryMega3D.
 *
 * Perf / SSR strategy:
 *   CategoryMega3D is a "use client" component that may spawn a WebGL Canvas.
 *   To avoid SSR issues and eager WebGL init for all 8 categories, the 3-D
 *   slot is only mounted for the currently-hovered category row, and it is
 *   loaded via next/dynamic with ssr:false so the Canvas never executes
 *   server-side. Unhovered rows show a lightweight skeleton placeholder.
 */

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { getCategoriesByAxis, AXIS_LABEL } from "@/lib/services";
import type { ServiceCategory, ServiceAxis } from "@/lib/services";

// Dynamic import — ssr:false prevents WebGL Canvas from running on the server
// and defers bundle loading until the menu is actually rendered client-side.
const CategoryMega3D = dynamic(
  () =>
    import("./CategoryMega3D").then((mod) => ({ default: mod.CategoryMega3D })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square w-16 shrink-0 animate-pulse rounded-md bg-neutral-800" />
    ),
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServicesMegaMenuProps {
  /** Called when a link is clicked — Task 9 (Header) uses this to close the panel. */
  onNavigate?: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: ServiceCategory;
  onNavigate?: () => void;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function CategoryRow({
  category,
  onNavigate,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: CategoryRowProps): React.JSX.Element {
  return (
    <Link
      href={`/servicii/${category.slug}`}
      onClick={onNavigate}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      className={cn(
        "flex items-start gap-3 rounded-md px-3 py-2 transition-colors",
        "hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
      )}
    >
      {/* 3-D preview — only mounted for the hovered row to avoid spawning 8 canvases */}
      <div className="w-16 shrink-0">
        {isHovered ? (
          <CategoryMega3D category={category} className="w-16" />
        ) : (
          <div className="aspect-square w-full rounded-md bg-neutral-800/60" />
        )}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium text-text-primary">{category.label}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
          {category.shortBlurb}
        </p>
      </div>
    </Link>
  );
}

interface AxisColumnProps {
  axis: ServiceAxis;
  categories: ServiceCategory[];
  hoveredSlug: string | null;
  onHover: (slug: string | null) => void;
  onNavigate?: () => void;
}

function AxisColumn({
  axis,
  categories,
  hoveredSlug,
  onHover,
  onNavigate,
}: AxisColumnProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-primary">
        {AXIS_LABEL[axis]}
      </p>
      {categories.map((cat) => (
        <CategoryRow
          key={cat.slug}
          category={cat}
          onNavigate={onNavigate}
          isHovered={hoveredSlug === cat.slug}
          onMouseEnter={() => onHover(cat.slug)}
          onMouseLeave={() => onHover(null)}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const AXES: ServiceAxis[] = ["exterior", "interior"];

export function ServicesMegaMenu({
  onNavigate,
}: ServicesMegaMenuProps): React.JSX.Element {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "w-[min(90vw,880px)] rounded-lg border border-border",
        "bg-bg-base/95 p-6 shadow-2xl backdrop-blur-md",
      )}
      role="dialog"
      aria-label="Meniu servicii"
    >
      {/* Heading */}
      <p className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-text-muted">
        Servicii ATESS
      </p>

      {/* Two-column grid: Exterior | Interior */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {AXES.map((axis) => (
          <AxisColumn
            key={axis}
            axis={axis}
            categories={getCategoriesByAxis(axis)}
            hoveredSlug={hoveredSlug}
            onHover={setHoveredSlug}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Footer cross-links */}
      <div className="mt-6 flex items-center gap-6 border-t border-border pt-4">
        <Link
          href="/servicii"
          onClick={onNavigate}
          className={cn(
            "text-xs uppercase tracking-wider text-text-muted",
            "transition-colors hover:text-text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded",
          )}
        >
          Toate serviciile
        </Link>
        <Link
          href="/proiecte"
          onClick={onNavigate}
          className={cn(
            "text-xs uppercase tracking-wider text-text-muted",
            "transition-colors hover:text-text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded",
          )}
        >
          Vezi proiecte
        </Link>
      </div>
    </div>
  );
}
