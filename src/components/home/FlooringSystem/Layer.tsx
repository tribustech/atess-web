"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Mesh, type MeshStandardMaterial } from 'three';
import type { LayerConfig, LayerId } from './layers.config';

type Slot = { current: number };

type LayerProps = {
  config: LayerConfig;
  material: MeshStandardMaterial;
  targetY: Slot;
  hoveredIdRef: React.MutableRefObject<LayerId | null>;
  onHover: (id: LayerId | null) => void;
  interactive: boolean;
};

export function Layer({
  config,
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
    const isHovered = hoveredId === config.id;
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
              onHover(config.id);
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
      <boxGeometry args={[config.size[0], config.thickness, config.size[1]]} />
    </mesh>
  );
}
