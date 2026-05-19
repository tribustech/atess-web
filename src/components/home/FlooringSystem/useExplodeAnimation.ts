import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Options = {
  sectionRef: React.RefObject<HTMLElement | null>;
  enabled: boolean;
};

/**
 * Wires a ScrollTrigger to the section and writes progress 0..1 into a ref.
 * Returns the progressRef so `useFrame` can read it without triggering React renders.
 * When `enabled` is false (reduced motion), progress is clamped to 1 so layers render fully exploded.
 */
export function useExplodeAnimation({ sectionRef, enabled }: Options) {
  const progressRef = useRef<number>(enabled ? 0 : 1);

  useEffect(() => {
    if (!enabled) {
      progressRef.current = 1;
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [sectionRef, enabled]);

  return progressRef;
}
