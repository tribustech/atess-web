"use client";

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { FlooringSystem } from './flooring-systems';
import { useLayerMaterials } from './useLayerMaterials';
import { Layer } from './Layer';

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

/**
 * Converts a thicknessMm value to scene units.
 * Min-clamp ensures even thin adhesive/primer layers remain visible.
 */
const MM_TO_SCENE = 0.007;
const MIN_THICKNESS = 0.13;

function toSceneThickness(mm: number): number {
  return Math.max(mm * MM_TO_SCENE, MIN_THICKNESS);
}

/**
 * Collapsed-state Y centre for layer at `index`.
 * Layers are stacked bottom → top; the stack is shifted so its base sits
 * at roughly −0.4 (matching the ContactShadows position in FlooringScene).
 */
function collapsedCenterYFor(
  thicknesses: number[],
  index: number,
): number {
  let y = 0;
  for (let i = 0; i < index; i++) y += thicknesses[i];
  y += thicknesses[index] / 2;
  return y - 0.4;
}

/**
 * Explode offset for a layer: higher layers spread further apart.
 * Scaled so the top layer reaches ~1.8 scene units above its rest position,
 * matching the original 4-layer config's spread for visual consistency.
 */
function explodeOffsetFor(index: number, total: number): number {
  if (total <= 1) return 0;
  return (index / (total - 1)) * 1.8;
}

// ---------------------------------------------------------------------------
// Layer size (X/Z footprint) — slight taper gives a layered-cake depth cue.
// ---------------------------------------------------------------------------

const BASE_SIZE = 4.0;
const SIZE_TAPER = 0.06; // each higher layer is slightly smaller

function layerSize(index: number): [number, number] {
  const s = BASE_SIZE - index * SIZE_TAPER;
  return [s, s];
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LayerStackProps = {
  system: FlooringSystem;
  progressRef: React.MutableRefObject<number>;
  hoveredIdRef: React.MutableRefObject<number | null>;
  onHoverChange: (id: number | null) => void;
  autoRotate: boolean;
  interactive: boolean;
  scale?: number;
  /** Per-face mesh subdivision for displacement relief. Lower it for the small
   *  mega-menu mini models to keep the triangle count in check. */
  segments?: number;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function LayerStack({
  system,
  progressRef,
  hoveredIdRef,
  onHoverChange,
  autoRotate,
  interactive,
  scale = 0.7,
  segments = 72,
}: LayerStackProps) {
  const rotatingGroupRef = useRef<Group>(null);
  const materials = useLayerMaterials(system);

  const layers = system.layers;

  // Pre-compute scene thicknesses and per-layer geometry — stable per system.
  const geometry = useMemo(() => {
    const thicknesses = layers.map((l) => toSceneThickness(l.thicknessMm));
    const total = layers.length;
    return layers.map((_, i) => ({
      thickness: thicknesses[i],
      size: layerSize(i),
      collapsedY: collapsedCenterYFor(thicknesses, i),
      explodeOffset: explodeOffsetFor(i, total),
    }));
  }, [layers]);

  // One mutable slot per layer to ferry targetY into the R3F frameloop
  // without triggering React re-renders.
  const targetYSlots = useMemo(
    () => layers.map(() => ({ current: 0 })),
    [layers],
  );

  useFrame((_, dt) => {
    const p = progressRef.current;
    const eased = easeOutCubic(p);

    geometry.forEach((g, i) => {
      targetYSlots[i].current = g.collapsedY + g.explodeOffset * eased;
    });

    if (rotatingGroupRef.current && autoRotate) {
      const rotSpeed =
        0.08 * (1 - Math.min(1, Math.max(0, (eased - 0.9) / 0.1)) * 0.7);
      rotatingGroupRef.current.rotation.y += dt * rotSpeed;
    }
  });

  return (
    <group scale={scale}>
      <group ref={rotatingGroupRef} rotation={[0.15, -0.5, 0]}>
        {layers.map((layer, i) => (
          <Layer
            key={`${system.id}-${i}`}
            config={layer}
            index={i}
            size={geometry[i].size}
            thickness={geometry[i].thickness}
            material={materials[String(i)]}
            targetY={targetYSlots[i]}
            hoveredIdRef={hoveredIdRef}
            onHover={onHoverChange}
            interactive={interactive}
            segments={segments}
          />
        ))}
      </group>
    </group>
  );
}
