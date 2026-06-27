"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  heroSlides,
  heroTrackPoster,
  heroTrackVideo,
  heroVideo,
} from "./homeMedia";
import type { HeroSlide, HeroTextPosition } from "./homeMedia";

type MediaItem =
  | { type: "video"; src: string; poster?: string; slide: HeroSlide }
  | { type: "image"; src: string; slide: HeroSlide };

const MEDIA: MediaItem[] = [
  {
    type: "video",
    src: heroTrackVideo,
    poster: heroTrackPoster,
    slide: {
      src: heroTrackVideo,
      eyebrow: "Piste de atletism",
      headline: ["Viteză", "pe suprafețe", "de competiție."],
      caption:
        "Piste de atletism turnate la standarde de competiție, construite să reziste.",
      href: "/servicii/sport-outdoor",
      cta: "Vezi pardoseli outdoor",
      position: "bottom-left",
    } satisfies HeroSlide,
  },
  { type: "image", src: heroSlides[0].src, slide: heroSlides[0] },
  {
    type: "video",
    src: heroVideo,
    slide: {
      src: heroVideo,
      eyebrow: "Pardoseli profesionale",
      headline: ["Suprafețe", "construite", "să reziste."],
      caption:
        "Sisteme complete pentru exterior și interior, executate la cheie.",
      href: "/servicii",
      cta: "Explorează serviciile",
      position: "center-left",
    } satisfies HeroSlide,
  },
  ...heroSlides.slice(1).map((slide) => ({
    type: "image" as const,
    src: slide.src,
    slide,
  })),
];

const VIDEO_DURATION = 5500;
const IMAGE_DURATION = 5000;

function durationOf(i: number) {
  return MEDIA[i].type === "video" ? VIDEO_DURATION : IMAGE_DURATION;
}

// Maps a slide's text position to the alignment of the full-height overlay grid
// and the cluster within it.
const POSITION: Record<HeroTextPosition, { grid: string; cluster: string }> = {
  "bottom-left": { grid: "items-end justify-start", cluster: "items-start text-left" },
  "center-left": { grid: "items-center justify-start", cluster: "items-start text-left" },
  "bottom-right": { grid: "items-end justify-end", cluster: "items-end text-right" },
  "center-right": { grid: "items-center justify-end", cluster: "items-end text-right" },
  center: { grid: "items-center justify-center", cluster: "items-center text-center" },
};

export function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const [{ active, prev }, setIndices] = useState({ active: 0, prev: -1 });
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const slide = MEDIA[active].slide;

  const goTo = (i: number) =>
    setIndices((s) => (s.active === i ? s : { active: i, prev: s.active }));

  // Auto-advance
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => {
      setIndices((s) => ({ active: (s.active + 1) % MEDIA.length, prev: s.active }));
    }, durationOf(active));
    return () => window.clearTimeout(id);
  }, [active, reduced]);

  // Restart the active video whenever it becomes the active slide
  useEffect(() => {
    const el = videoRefs.current[active];
    if (MEDIA[active].type === "video" && el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  }, [active]);

  return (
    <div className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-bg-base text-white">
      {/* Media layers */}
      <div className="absolute inset-0">
        {MEDIA.map((item, i) => {
          const isActive = i === active;
          const isPrev = i === prev;
          const visible = isActive || isPrev;
          const z = isActive ? 30 : isPrev ? 20 : 0;
          return (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              style={{ zIndex: z, opacity: visible ? 1 : 0 }}
            >
              {/* Wipe wrapper: diagonal clip reveal on the active slide only */}
              <div
                className="absolute inset-0"
                style={{
                  animation:
                    isActive && !reduced
                      ? "heroWipeIn 760ms cubic-bezier(0.76, 0, 0.18, 1) both"
                      : undefined,
                }}
              >
                {item.type === "video" ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={item.src}
                    poster={item.poster}
                    muted
                    playsInline
                    autoPlay
                    loop={MEDIA.length === 1}
                    preload={i === 0 ? "auto" : "metadata"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{
                      // Slow zoom holds through the transition (visible = active or prev),
                      // so there is no snap-back when a slide hands off.
                      animation:
                        visible && !reduced
                          ? "heroZoom 8s ease-out both"
                          : undefined,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrims for legibility */}
      <div className="pointer-events-none absolute inset-0 z-[45] bg-gradient-to-r from-black/90 via-black/55 to-black/20" />
      <div className="pointer-events-none absolute inset-0 z-[45] bg-gradient-to-b from-black/40 via-transparent to-black/90" />

      {/* Foreground content — relocates per slide */}
      <div className="pointer-events-none absolute inset-0 z-50 flex justify-center px-5 pb-28 pt-24 sm:px-6 sm:pb-32 sm:pt-28 md:px-10 md:pb-36">
        <div className={`flex h-full w-full max-w-7xl ${POSITION[slide.position].grid}`}>
          <div
            key={`cluster-${active}`}
            className={`pointer-events-auto flex w-full max-w-2xl flex-col ${POSITION[slide.position].cluster}`}
            style={reduced ? undefined : { animation: "heroClusterIn 700ms ease-out both" }}
          >
            <div className="mb-5 flex items-center gap-3 sm:mb-6">
              <span className="h-px w-8 bg-accent-primary sm:w-10" />
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:text-[11px] sm:tracking-[0.35em]">
                {slide.eyebrow}
              </p>
            </div>

            <h1 className="text-[2.5rem] font-semibold leading-[1] tracking-tight sm:text-5xl sm:leading-[0.95] md:text-7xl lg:text-[80px]">
              {slide.headline.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em]">
                  <span
                    className={`block ${i === slide.headline.length - 1 ? "text-accent-primary" : ""}`}
                    style={
                      reduced
                        ? undefined
                        : {
                            animation: `heroLineUp 900ms cubic-bezier(0.22, 1, 0.36, 1) both`,
                            animationDelay: `${160 + i * 110}ms`,
                          }
                    }
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-xl text-base text-white/75 sm:mt-8 md:text-lg">
              {slide.caption}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link href="/configurator" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full border border-white/20 bg-accent-primary/85 px-6 text-sm text-white shadow-lg shadow-black/20 backdrop-blur-md hover:bg-accent-primary sm:h-14 sm:w-auto sm:px-8 sm:text-base"
                >
                  Configurează-ți proiectul
                </Button>
              </Link>
              <Link href={slide.href} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group h-12 w-full border border-white/25 bg-white/10 px-6 text-sm text-white shadow-lg shadow-black/20 backdrop-blur-md hover:bg-white/20 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
                >
                  {slide.cta}
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category rail + progress */}
      <div className="absolute inset-x-0 bottom-0 z-50 px-5 pb-6 sm:px-6 sm:pb-8 md:px-10">
        <div className="mx-auto w-full max-w-7xl">
          {/* Progress track */}
          <div className="relative h-px w-full bg-white/15">
            <div
              key={`progress-${active}`}
              className="absolute left-0 top-0 h-px bg-accent-primary"
              style={
                reduced
                  ? { width: "100%" }
                  : {
                      width: "0%",
                      animation: `heroProgress ${durationOf(active)}ms linear forwards`,
                    }
              }
            />
          </div>

          <div className="mt-4 flex items-center gap-4 overflow-x-auto sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 font-mono text-xs tabular-nums text-white/55">
              {String(active + 1).padStart(2, "0")}
              <span className="text-white/30"> / {String(MEDIA.length).padStart(2, "0")}</span>
            </span>
            <div className="flex items-center gap-4 sm:gap-6">
              {MEDIA.map((item, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`shrink-0 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {item.slide.eyebrow}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroWipeIn {
          0%   { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
          100% { clip-path: polygon(0 0, 135% 0, 100% 100%, 0 100%); }
        }
        @keyframes heroZoom {
          0%   { transform: scale(1.06); }
          100% { transform: scale(1.18); }
        }
        @keyframes heroLineUp {
          0%   { transform: translateY(110%); }
          100% { transform: translateY(0); }
        }
        @keyframes heroClusterIn {
          0%   { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroProgress {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
