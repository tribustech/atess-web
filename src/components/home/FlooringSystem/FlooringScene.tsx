"use client";

import { Suspense } from 'react';
import { Environment, ContactShadows } from '@react-three/drei';
import { LayerStack } from './LayerStack';
import type { LayerId } from './layers.config';

type FlooringSceneProps = {
  progressRef: React.MutableRefObject<number>;
  hoveredIdRef: React.MutableRefObject<LayerId | null>;
  onHoverChange: (id: LayerId | null) => void;
  autoRotate: boolean;
  interactive: boolean;
};

export function FlooringScene({
  progressRef,
  hoveredIdRef,
  onHoverChange,
  autoRotate,
  interactive,
}: FlooringSceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
      />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <LayerStack
          progressRef={progressRef}
          hoveredIdRef={hoveredIdRef}
          onHoverChange={onHoverChange}
          autoRotate={autoRotate}
          interactive={interactive}
        />
      </Suspense>
      <ContactShadows
        position={[0, -0.41, 0]}
        opacity={0.5}
        blur={2.5}
        far={4}
        resolution={1024}
      />
    </>
  );
}
