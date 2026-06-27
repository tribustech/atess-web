"use client";

/**
 * FlooringMiniModel — compact, mega-menu-oriented 3-D layered model.
 *
 * Cross-plan contract (master plan §3): signature is fixed.
 * Consumed by the Servicii mega-menu (Plan C).
 *
 * Renders a small, always-looping explode animation at a reduced canvas size.
 * `autoRotate` defaults true; `interactive` defaults false.
 */

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { NeutralToneMapping } from 'three';
import { getFlooringSystem, type FlooringSystemId } from './flooring-systems';
import { LayerStack } from './LayerStack';
import { useExplodeAnimation } from './useExplodeAnimation';

// ---------------------------------------------------------------------------
// Internal scene — runs inside R3F Canvas
// ---------------------------------------------------------------------------

type MiniSceneProps = {
  system: ReturnType<typeof getFlooringSystem>;
  autoRotate: boolean;
  interactive: boolean;
  sectionRef: React.RefObject<HTMLDivElement | null>;
};

function MiniScene({ system, autoRotate, interactive, sectionRef }: MiniSceneProps) {
  const progressRef = useExplodeAnimation({ sectionRef, enabled: autoRotate });
  const hoveredIdRef = useRef<number | null>(null);

  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[4, 6, 4]} intensity={1.9} />
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.3} />
        <LayerStack
          system={system}
          progressRef={progressRef}
          hoveredIdRef={hoveredIdRef}
          onHoverChange={() => undefined}
          autoRotate={autoRotate}
          interactive={interactive}
          scale={0.45}
          segments={40}
        />
      </Suspense>
    </>
  );
}

// ---------------------------------------------------------------------------
// Public component — cross-plan contract; do NOT rename
// ---------------------------------------------------------------------------

export type FlooringMiniModelProps = {
  systemId: FlooringSystemId;
  autoRotate?: boolean;
  interactive?: boolean;
};

export function FlooringMiniModel({
  systemId,
  autoRotate = true,
  interactive = false,
}: FlooringMiniModelProps): React.JSX.Element {
  const system = getFlooringSystem(systemId);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, toneMapping: NeutralToneMapping, toneMappingExposure: 1.1 }}
        camera={{ position: [3.5, 2.5, 4.0], fov: 42 }}
      >
        <MiniScene
          system={system}
          autoRotate={autoRotate}
          interactive={interactive}
          sectionRef={containerRef}
        />
      </Canvas>
    </div>
  );
}
