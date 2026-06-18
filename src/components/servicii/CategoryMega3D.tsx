"use client";

/**
 * CategoryMega3D — 3-D preview slot for the servicii mega-menu.
 *
 * Cross-plan contract (master plan §3, Task 3):
 * - Categories WITH a model3dId (sport-outdoor, sport-indoor, locuri-joaca,
 *   pardoseli-piatra) render <FlooringMiniModel systemId={model3dId} autoRotate />.
 * - Categories WITHOUT a model3dId (mocheta, pvc-linoleum, lvt, alei-pietonale)
 *   render a graceful image/gradient fallback — never a broken 3-D canvas.
 *
 * Task 4 (mega-menu assembly) imports CategoryMega3DProps from here.
 */

import React, { Suspense } from "react";
import Image from "next/image";
import { Box } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { FlooringMiniModel } from "@/components/home/FlooringSystem";
import type { FlooringSystemId } from "@/components/home/FlooringSystem";
import type { ServiceCategory } from "@/lib/services";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CategoryMega3DProps {
  /** Full service category record. Drives both the 3-D path and the fallback. */
  category: ServiceCategory;
  /** Additional Tailwind classes applied to the outer container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Rendered when the category has a matching 3-D model. */
function ModelSlot({
  systemId,
}: {
  systemId: FlooringSystemId;
}): React.JSX.Element {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-neutral-950">
      <Suspense
        fallback={
          <div className="absolute inset-0 animate-pulse bg-neutral-800" />
        }
      >
        <FlooringMiniModel
          systemId={systemId}
          autoRotate
          interactive={false}
        />
      </Suspense>
    </div>
  );
}

/** Rendered when the category has NO 3-D model — uses layerPhoto as visual anchor. */
function PhotoFallback({
  category,
}: {
  category: ServiceCategory;
}): React.JSX.Element {
  const { layerPhoto } = category;

  if (!layerPhoto.placeholder) {
    // Real photo available — render it.
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-neutral-900">
        <Image
          src={layerPhoto.src}
          alt={layerPhoto.alt}
          fill
          className="object-cover"
          sizes="160px"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent"
        />
      </div>
    );
  }

  // Placeholder only — render a muted gradient tile with a Box icon.
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-md",
        "bg-gradient-to-br from-neutral-800 to-neutral-950",
      )}
    >
      <Box
        aria-hidden="true"
        className="absolute left-2 top-2 h-4 w-4 text-text-muted opacity-60"
        strokeWidth={1.5}
      />
      <span className="absolute inset-0 grid place-items-center text-[10px] uppercase tracking-widest text-text-muted">
        {category.label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component — Task 4 assembles the menu and imports this
// ---------------------------------------------------------------------------

export function CategoryMega3D({
  category,
  className,
}: CategoryMega3DProps): React.JSX.Element {
  const { model3dId } = category;

  return (
    <div className={cn("shrink-0", className)}>
      {model3dId ? (
        <ModelSlot systemId={model3dId} />
      ) : (
        <PhotoFallback category={category} />
      )}
    </div>
  );
}
