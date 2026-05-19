"use client";

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { LAYERS, collapsedCenterY, type LayerId } from './layers.config';
import { useLayerMaterials } from './useLayerMaterials';
import { Layer } from './Layer';

type LayerStackProps = {
  progressRef: React.MutableRefObject<number>;
  hoveredIdRef: React.MutableRefObject<LayerId | null>;
  onHoverChange: (id: LayerId | null) => void;
  autoRotate: boolean;
  interactive: boolean;
  scale?: number;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function LayerStack({
  progressRef,
  hoveredIdRef,
  onHoverChange,
  autoRotate,
  interactive,
  scale = 0.7,
}: LayerStackProps) {
  const rotatingGroupRef = useRef<Group>(null);
  const materials = useLayerMaterials();

  const targetYSlots = useMemo(() => LAYERS.map(() => ({ current: 0 })), []);

  useFrame((_, dt) => {
    const p = progressRef.current;
    const eased = easeOutCubic(p);

    LAYERS.forEach((layer, i) => {
      const baseY = collapsedCenterY(i);
      targetYSlots[i].current = baseY + layer.explodeOffset * eased;
    });

    if (rotatingGroupRef.current && autoRotate) {
      const rotSpeed = 0.08 * (1 - Math.min(1, Math.max(0, (eased - 0.9) / 0.1)) * 0.7);
      rotatingGroupRef.current.rotation.y += dt * rotSpeed;
    }
  });

  return (
    <group scale={scale}>
      <group ref={rotatingGroupRef} rotation={[0.15, -0.5, 0]}>
        {LAYERS.map((layer, i) => (
          <Layer
            key={layer.id}
            config={layer}
            material={materials[layer.id]}
            targetY={targetYSlots[i]}
            hoveredIdRef={hoveredIdRef}
            onHover={onHoverChange}
            interactive={interactive}
          />
        ))}
      </group>
    </group>
  );
}
