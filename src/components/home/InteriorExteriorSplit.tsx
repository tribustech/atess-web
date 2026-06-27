"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Panel = {
  img: string;
  alt: string;
  eyebrow: string;
  promise: string;
  tags: string[];
  href: string;
  cta: string;
};

const EXTERIOR: Panel = {
  img: "/images/1505c0a0-d7e5-4532-ba42-f7bd950f290b.webp",
  alt: "Pistă de atletism roșie cu marcaje pe culoare, executată de ATESS Project",
  eyebrow: "Exterior",
  promise: "Rezistă la UV, îngheț și trafic intens.",
  tags: ["Sport outdoor", "Locuri de joacă", "Piatră", "Alei"],
  href: "/servicii#exterior",
  cta: "Vezi exterior",
};

const INTERIOR: Panel = {
  img: "/images/b48ce4d2-6dc5-4bd0-9849-35076f6d5680.webp",
  alt: "Pardoseală turnată albastră, lucioasă, într-o sală de sport interioară",
  eyebrow: "Interior",
  promise: "Confort, acustică și finisaj impecabil.",
  tags: ["Sport indoor", "Mochetă", "PVC / Linoleum", "LVT"],
  href: "/servicii#interior",
  cta: "Vezi interior",
};

const MIN = 6;
const MAX = 94;
const clamp = (n: number) => Math.max(MIN, Math.min(MAX, n));

export function InteriorExteriorSplit() {
  // Percentage of the frame given to the Exterior (base) side; the Interior
  // layer is clipped from the left by this amount. 50 = even split.
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [hinting, setHinting] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const stopHint = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHinting(false);
  }, []);

  // One-time affordance nudge: the first time the frame is ≥60% in view, sweep
  // the divider left→right→center so it reads as draggable. Skipped if the user
  // prefers reduced motion or has already grabbed the handle.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || reduced) return;
    let played = false;

    const play = () => {
      setHinting(true);
      const path = [50, 34, 66, 50];
      const seg = 520; // ms per segment
      const total = seg * (path.length - 1);
      let start: number | null = null;
      const tick = (now: number) => {
        if (start === null) start = now;
        const t = now - start;
        if (t >= total) {
          setSplit(50);
          rafRef.current = null;
          setHinting(false);
          return;
        }
        const i = Math.min(path.length - 2, Math.floor(t / seg));
        const localT = (t - i * seg) / seg;
        const eased = 0.5 - 0.5 * Math.cos(Math.PI * localT); // ease-in-out
        setSplit(path[i] + (path[i + 1] - path[i]) * eased);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!played && entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            played = true;
            io.disconnect();
            play();
          }
        }
      },
      { threshold: [0.6] }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSplit(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    stopHint();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setFromClientX(e.clientX);
  };
  const endDrag = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    stopHint();
    if (e.key === "ArrowLeft") setSplit((s) => clamp(s - 3));
    else if (e.key === "ArrowRight") setSplit((s) => clamp(s + 3));
    else if (e.key === "Home") setSplit(MIN);
    else if (e.key === "End") setSplit(MAX);
    else return;
    e.preventDefault();
  };

  // Fade each text cluster out once its side gets too narrow to read.
  const exteriorOpacity = Math.max(0, Math.min(1, (split - 10) / 16));
  const interiorOpacity = Math.max(0, Math.min(1, (90 - split) / 16));
  // No CSS transition while actively dragging or running the rAF hint — both
  // drive `split` per-frame and a transition would lag behind.
  const clipTransition = dragging || hinting ? "none" : "clip-path 200ms ease-out";

  return (
    <div className="bg-bg-base">
      <div className="mx-auto max-w-7xl px-5 pt-20 text-center sm:px-6 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-primary">
          Interior &amp; Exterior
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-display-lg text-text-primary">
          Două lumi, o singură echipă.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-text-muted">
          De la suprafețe expuse la intemperii la finisaje interioare — trage de
          riglă pentru a compara cele două lumi pe care le construim.
        </p>
      </div>

      {/* Comparison frame */}
      <div
        ref={frameRef}
        className="relative mt-10 h-[62svh] min-h-[420px] w-full select-none overflow-hidden sm:mt-12 sm:h-[72svh]"
      >
        {/* Base layer — Exterior */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={EXTERIOR.img}
          alt={EXTERIOR.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

        {/* Top layer — Interior, clipped from the left by `split` */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 0 0 ${split}%)`,
            transition: clipTransition,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={INTERIOR.img}
            alt={INTERIOR.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Exterior content cluster (anchored bottom-left) */}
        <div
          className="absolute bottom-0 left-0 z-20 flex max-w-[46%] flex-col items-start p-6 text-left text-white sm:p-10"
          style={{ opacity: exteriorOpacity }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:text-[11px] sm:text-white/80">
            {EXTERIOR.eyebrow}
          </p>
          <p className="mt-2 hidden text-lg font-semibold leading-tight sm:block sm:text-2xl">
            {EXTERIOR.promise}
          </p>
          <ul className="mt-3 hidden flex-wrap gap-2 sm:flex">
            {EXTERIOR.tags.map((t) => (
              <li
                key={t}
                className="border border-white/25 bg-white/10 px-2.5 py-1 text-xs text-white/90 backdrop-blur-sm"
              >
                {t}
              </li>
            ))}
          </ul>
          <Link
            href={EXTERIOR.href}
            className="group mt-5 hidden h-11 items-center gap-2 border border-white/25 bg-white/10 px-5 text-sm uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20 sm:inline-flex"
          >
            {EXTERIOR.cta}
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Interior content cluster (anchored bottom-right) */}
        <div
          className="absolute bottom-0 right-0 z-20 flex max-w-[46%] flex-col items-end p-6 text-right text-white sm:p-10"
          style={{ opacity: interiorOpacity }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:text-[11px] sm:text-white/80">
            {INTERIOR.eyebrow}
          </p>
          <p className="mt-2 hidden text-lg font-semibold leading-tight sm:block sm:text-2xl">
            {INTERIOR.promise}
          </p>
          <ul className="mt-3 hidden flex-wrap justify-end gap-2 sm:flex">
            {INTERIOR.tags.map((t) => (
              <li
                key={t}
                className="border border-white/25 bg-white/10 px-2.5 py-1 text-xs text-white/90 backdrop-blur-sm"
              >
                {t}
              </li>
            ))}
          </ul>
          <Link
            href={INTERIOR.href}
            className="group mt-5 hidden h-11 items-center gap-2 border border-white/25 bg-white/10 px-5 text-sm uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20 sm:inline-flex"
          >
            {INTERIOR.cta}
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Draggable divider */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Trage pentru a compara interior și exterior"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={Math.round(split)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          className="absolute inset-y-0 z-30 -ml-5 flex w-10 cursor-ew-resize touch-none items-center justify-center focus:outline-none"
          style={{ left: `${split}%`, transition: clipTransition }}
        >
          <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/80" />
          <span className="pointer-events-none flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-md">
            <span aria-hidden className="text-sm tracking-tighter">
              ◀▶
            </span>
          </span>
        </div>
      </div>

      {/* Mobile: the photo halves stay label-only; the full detail lives here in
          stacked cards where there is room to read it. */}
      <div className="mx-auto max-w-7xl space-y-4 px-5 pb-2 pt-8 sm:hidden">
        {[EXTERIOR, INTERIOR].map((p) => (
          <div
            key={p.eyebrow}
            className="border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-primary">
              {p.eyebrow}
            </p>
            <p className="mt-2 text-lg font-semibold text-text-primary">
              {p.promise}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <li
                  key={t}
                  className="border border-white/15 bg-white/[0.04] px-2.5 py-1 text-xs text-text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href={p.href}
              className="mt-4 flex h-12 items-center justify-center gap-2 border border-accent-primary text-sm uppercase tracking-wider text-accent-primary"
            >
              {p.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
