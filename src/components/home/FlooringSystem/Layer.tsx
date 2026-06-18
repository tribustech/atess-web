"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Mesh, type MeshStandardMaterial } from 'three';
import type { FlooringLayer } from './flooring-systems';

type Slot = { current: number };

export type LayerProps = {
  config: FlooringLayer;
  index: number;
  /** X/Z footprint in scene units. */
  size: [number, number];
  /** Visual thickness in scene units (derived from thicknessMm by caller). */
  thickness: number;
  material: MeshStandardMaterial;
  targetY: Slot;
  hoveredIdRef: React.MutableRefObject<number | null>;
  onHover: (id: number | null) => void;
  interactive: boolean;
};

export function Layer({
  index,
  size,
  thickness,
  material,
  targetY,
  hoveredIdRef,
  onHover,
  interactive,
}: LayerProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, dt) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.position.y = MathUtils.damp(mesh.position.y, targetY.current, 10, dt);

    const hoveredId = hoveredIdRef.current;
    const isHovered = hoveredId === index;
    const anyHovered = hoveredId !== null;

    // Scale: hovered pops slightly, others shrink a hair for contrast.
    const targetScale = isHovered ? 1.06 : anyHovered ? 0.97 : 1;
    const s = MathUtils.damp(mesh.scale.x, targetScale, 10, dt);
    mesh.scale.set(s, s, s);

    // Emissive highlight
    const mat = mesh.material as MeshStandardMaterial;
    const targetEmissive = isHovered ? 0.25 : 0;
    mat.emissiveIntensity = MathUtils.damp(mat.emissiveIntensity, targetEmissive, 10, dt);
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      material={material}
      onPointerOver={
        interactive
          ? (e) => {
              e.stopPropagation();
              onHover(index);
              document.body.style.cursor = 'pointer';
            }
          : undefined
      }
      onPointerOut={
        interactive
          ? (e) => {
              e.stopPropagation();
              onHover(null);
              document.body.style.cursor = '';
            }
          : undefined
      }
    >
      <boxGeometry args={[size[0], thickness, size[1]]} />
    </mesh>
  );
}
