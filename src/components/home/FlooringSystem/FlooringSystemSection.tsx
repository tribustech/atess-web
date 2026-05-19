"use client";

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { gsap } from 'gsap';
import { LAYERS, type LayerId } from './layers.config';
import { FlooringScene } from './FlooringScene';
import { useExplodeAnimation } from './useExplodeAnimation';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function FlooringSystemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const interactive = !isMobile && !('ontouchstart' in window);

  const progressRef = useExplodeAnimation({ sectionRef, enabled: !reduced && !isMobile });

  useEffect(() => {
    if (!isMobile || reduced) return;
    const el = sectionRef.current;
    if (!el) return;

    // Mobile loop starts only when section enters viewport, so it doesn't
    // animate too early while off-screen.
    progressRef.current = 0.12;
    let tween: gsap.core.Tween | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!tween) {
            tween = gsap.to(progressRef, {
              current: 0.72,
              duration: 2.4,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          }
        } else if (tween) {
          tween.kill();
          tween = null;
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (tween) tween.kill();
    };
  }, [isMobile, reduced, progressRef]);

  // Bidirectional hover: list ↔ 3D layer.
  // State drives the React list UI; a mirror ref lets the R3F frameloop read
  // the latest value without forcing re-renders on each frame.
  const [hoveredId, setHoveredId] = useState<LayerId | null>(null);
  const hoveredIdRef = useRef<LayerId | null>(null);

  const setHover = (id: LayerId | null) => {
    hoveredIdRef.current = id;
    setHoveredId(id);
  };

  // Reversed (top → bottom visual order for the list).
  const orderedLayers = [...LAYERS].reverse();

  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        id="flooring-system"
        aria-labelledby="flooring-system-heading"
        className="bg-neutral-950 text-white"
      >
        <div className="relative h-[46vh] min-h-[320px] w-full" aria-hidden="true">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{ antialias: true, toneMapping: ACESFilmicToneMapping }}
            camera={{ position: [5.5, 3.8, 6.5], fov: 38 }}
          >
            <FlooringScene
              progressRef={progressRef}
              hoveredIdRef={hoveredIdRef}
              onHoverChange={setHover}
              autoRotate={!reduced}
              interactive={false}
            />
          </Canvas>
        </div>

        <div className="mx-auto w-full max-w-xl px-6 pb-12 pt-8">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/60">
            Construcția sistemului
          </p>
          <h2 id="flooring-system-heading" className="mb-6 text-3xl font-semibold leading-tight">
            Patru straturi.
            <br />
            O singură suprafață.
          </h2>
          <p className="mb-8 text-base text-white/70">
            Fiecare instalație Atess este proiectată pe straturi — fiecare cu rolul
            său, de la fundația aderentă până la suprafața finală pe care alergi.
          </p>

          <ul className="space-y-1">
            {orderedLayers.map((layer, i) => {
              const number = LAYERS.length - i;
              return (
                <li
                  key={layer.id}
                  className="relative overflow-hidden border-l-2 border-white/10 px-4 py-3 pl-5"
                >
                  <div className="relative flex items-baseline gap-4">
                    <span className="font-mono text-xs text-white/40">0{number}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white/90">{layer.label}</div>
                      <div className="mt-0.5 text-xs leading-relaxed text-white/55">
                        {layer.description}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-8 text-xs text-white/40">Derulează pentru a dezvălui straturile.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="flooring-system"
      aria-labelledby="flooring-system-heading"
      className="relative bg-neutral-950 text-white"
      style={{ height: '200vh' }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {/* 3D canvas — left side of the split */}
        <div
          className="absolute inset-y-0 left-0 right-0 md:right-[44%]"
          aria-hidden="true"
        >
          <Canvas
            shadows
            dpr={[1, isMobile ? 1.5 : 1.75]}
            gl={{ antialias: true, toneMapping: ACESFilmicToneMapping }}
            camera={{ position: [5.5, 3.8, 6.5], fov: 38 }}
          >
            <FlooringScene
              progressRef={progressRef}
              hoveredIdRef={hoveredIdRef}
              onHoverChange={setHover}
              autoRotate={!isMobile && !reduced}
              interactive={interactive}
            />
          </Canvas>
        </div>

        {/* Dark fade behind the copy column */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] bg-gradient-to-l from-neutral-950 via-neutral-950/90 to-transparent md:block" />

        {/* Copy + interactive layer list */}
        <div className="relative z-10 ml-auto w-full max-w-xl px-6 md:w-[44%] md:px-10 lg:px-16">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/60">
            Construcția sistemului
          </p>
          <h2
            id="flooring-system-heading"
            className="mb-6 text-4xl font-semibold leading-tight md:text-5xl"
          >
            Patru straturi.
            <br />
            O singură suprafață.
          </h2>
          <p className="mb-8 max-w-md text-base text-white/70">
            Fiecare instalație Atess este proiectată pe straturi — fiecare cu rolul
            său, de la fundația aderentă până la suprafața finală pe care alergi.
          </p>

          <ul className="space-y-1">
            {orderedLayers.map((layer, i) => {
              const number = LAYERS.length - i;
              const isActive = hoveredId === layer.id;
              const dim = hoveredId !== null && !isActive;
              return (
                <li
                  key={layer.id}
                  onMouseEnter={() => setHover(layer.id)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    transform: isActive
                      ? 'translateX(-28px) scale(1.06)'
                      : dim
                      ? 'translateX(6px) scale(0.98)'
                      : 'translateX(0) scale(1)',
                    transformOrigin: 'left center',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  className={`group relative cursor-default overflow-hidden border-l-2 pl-5 pr-4 py-3 transition-all duration-500 will-change-transform ${
                    isActive
                      ? 'border-accent-primary bg-white/[0.05] shadow-[0_20px_50px_-20px_rgba(178,58,42,0.5)]'
                      : dim
                      ? 'border-white/5 opacity-35'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Sliding accent bar behind the row */}
                  <div
                    className={`pointer-events-none absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-accent-primary/10 to-transparent transition-transform duration-500 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                  <div className="relative flex items-baseline gap-4">
                    <span
                      className={`font-mono text-xs transition-colors ${
                        isActive ? 'text-accent-primary' : 'text-white/40'
                      }`}
                    >
                      0{number}
                    </span>
                    <div className="flex-1">
                      <div
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? 'text-white' : 'text-white/90'
                        }`}
                      >
                        {layer.label}
                      </div>
                      <div
                        className={`mt-0.5 text-xs leading-relaxed transition-colors ${
                          isActive ? 'text-white/80' : 'text-white/55'
                        }`}
                      >
                        {layer.description}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-8 text-xs text-white/40">
            {reduced
              ? 'Mișcare redusă — animația este dezactivată.'
              : isMobile
              ? 'Derulează pentru a dezvălui straturile.'
              : 'Derulează pentru a separa straturile. Hover pe un strat pentru detalii.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default FlooringSystemSection;
