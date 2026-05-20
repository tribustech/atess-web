"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import partnersData from "@/data/partners.json";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { heroSlides, heroVideo } from "./homeMedia";

const manufacturers = partnersData.filter((p) => p.type === "manufacturer");

type MediaItem = { type: "video"; src: string } | { type: "image"; src: string };
const MEDIA: MediaItem[] = [
  { type: "image", src: heroSlides[0] },
  { type: "video", src: heroVideo },
  ...heroSlides.slice(1).map((src) => ({ type: "image" as const, src })),
];
const VIDEO_DURATION = 4000;
const IMAGE_DURATION = 5500;

export function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

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
              aria-hidden="true"
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
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-16 pt-28 md:px-10 md:pb-56">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-accent-primary" />
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
              Pardoseli sportive profesionale
            </p>
          </div>

          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-[88px]">
            Suprafețe
            <br />
            construite
            <br />
            <span className="text-accent-primary">să reziste.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base text-white/75 md:text-lg">
            Sisteme Stockmeier executate cu rigoare de șantier, detaliu tehnic
            și consultanță directă cu Teo Neagu.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/configurator">
              <Button size="lg">Configurează-ți proiectul</Button>
            </Link>
            <Link href="/proiecte">
              <Button size="lg" variant="outline">
                Vezi proiecte
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto border-t border-white/15 bg-gradient-to-t from-black/95 via-black/80 to-black/20 backdrop-blur-md md:absolute md:inset-x-0 md:bottom-0">
        <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-6 px-4 py-8 md:px-6 md:py-14">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/50">
              Parteneri certificați
            </span>
            <div className="flex flex-wrap items-center gap-5 md:gap-10">
              {manufacturers.map((m) => (
                <a
                  key={m.slug}
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 text-white transition hover:text-accent-primary"
                  title={m.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.logo}
                    alt={m.name}
                    className="h-10 w-auto max-w-[150px] object-contain opacity-95 drop-shadow-[0_0_10px_rgba(255,255,255,0.18)] transition group-hover:opacity-100 md:h-16 md:max-w-[260px]"
                  />
                </a>
              ))}
            </div>
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
