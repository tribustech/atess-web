import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type LenisLike = {
  on: (event: 'scroll', callback: () => void) => void;
  raf: (timeMs: number) => void;
  destroy: () => void;
};

type LenisControllerOptions = {
  createLenis: () => LenisLike;
  addTicker: (cb: (timeSeconds: number) => void) => void;
  removeTicker: (cb: (timeSeconds: number) => void) => void;
  updateScrollTrigger: () => void;
};

export type LenisController = {
  start: () => void;
  stop: () => void;
};

export function createLenisController(options: LenisControllerOptions): LenisController {
  let lenis: LenisLike | null = null;
  let tickerCallback: ((timeSeconds: number) => void) | null = null;

  return {
    start() {
      if (lenis) return;

      lenis = options.createLenis();
      lenis.on('scroll', options.updateScrollTrigger);

      tickerCallback = (timeSeconds) => {
        lenis?.raf(timeSeconds * 1000);
      };

      options.addTicker(tickerCallback);
    },
    stop() {
      if (!lenis) return;

      if (tickerCallback) {
        options.removeTicker(tickerCallback);
      }

      lenis.destroy();
      lenis = null;
      tickerCallback = null;
    },
  };
}

export function createDefaultLenisController(): LenisController {
  gsap.registerPlugin(ScrollTrigger);

  return createLenisController({
    createLenis: () =>
      new Lenis({
        smoothWheel: true,
        lerp: 0.08,
      }) as LenisLike,
    addTicker: gsap.ticker.add,
    removeTicker: gsap.ticker.remove,
    updateScrollTrigger: ScrollTrigger.update,
  });
}
