"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { heroSlides, heroVideo } from "./homeMedia";
import type { HeroSlide } from "./homeMedia";

type MediaItem =
  | { type: "video"; src: string; slide: HeroSlide }
  | { type: "image"; src: string; slide: HeroSlide };

const MEDIA: MediaItem[] = [
  { type: "image", src: heroSlides[0].src, slide: heroSlides[0] },
  { type: "video", src: heroVideo, slide: heroSlides[0] },
  ...heroSlides.slice(1).map((slide) => ({
    type: "image" as const,
    src: slide.src,
    slide,
  })),
];
const VIDEO_DURATION = 4000;
const IMAGE_DURATION = 5500;

export function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const active = MEDIA[activeIndex].slide;

  useEffect(() => {
    if (reduced) return;
    const current = MEDIA[activeIndex];
    const duration =
      current.type === "video" ? VIDEO_DURATION : IMAGE_DURATION;
    const id = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % MEDIA.length);
    }, duration);
    return () => window.clearTimeout(id);
  }, [activeIndex, reduced]);

  useEffect(() => {
    const current = MEDIA[activeIndex];
    if (current.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0">
        {MEDIA.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
              style={{ opacity: isActive ? 1 : 0 }}
            >
              <Link
                href={item.slide.href}
                aria-label={item.slide.caption}
                tabIndex={isActive ? 0 : -1}
                className="block h-full w-full"
              >
                {item.type === "video" ? (
                  <video
                    ref={videoRef}
                    src={item.src}
                    muted
                    playsInline
                    autoPlay
                    loop={MEDIA.length === 1}
                    className="h-full w-full object-cover"
                    style={{
                      animation:
                        reduced || !isActive
                          ? undefined
                          : "heroKenBurnsVideo 10s ease-out forwards",
                    }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{
                      animation:
                        reduced || !isActive
                          ? undefined
                          : "heroKenBurns 8s ease-out forwards",
                    }}
                  />
                )}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 md:px-10 md:pb-24">
        <div className="w-full max-w-2xl">
          <div className="mb-5 flex items-center gap-3 sm:mb-6">
            <span className="h-px w-8 bg-accent-primary sm:w-10" />
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent-primary sm:text-[11px] sm:tracking-[0.35em]">
              {active.eyebrow}
            </p>
          </div>

          <h1 className="text-[2.5rem] font-semibold leading-[1] tracking-tight sm:text-5xl sm:leading-[0.95] md:text-7xl lg:text-[88px]">
            Suprafețe
            <br />
            construite
            <br />
            <span className="text-accent-primary">să reziste.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-white/75 sm:mt-8 md:text-lg">
            {active.caption}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link href={active.href} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-12 w-full px-6 text-base sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
              >
                Descoperă categoria
              </Button>
            </Link>
            <Link href="/configurator" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full px-6 text-base sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
              >
                Configurează-ți proiectul
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroKenBurns {
          0% {
            transform: scale(1.05) translate3d(0, 0, 0);
          }
          100% {
            transform: scale(1.2) translate3d(-1%, -1%, 0);
          }
        }
        @keyframes heroKenBurnsVideo {
          0% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1.12);
          }
        }
      `}</style>
    </div>
  );
}
