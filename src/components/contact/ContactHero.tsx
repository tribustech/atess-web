"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SITE_CONTACT } from "@/lib/site-contact";

export function ContactHero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rev]", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });
      gsap.from("[data-rule]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "power4.out",
        delay: 0.25,
      });
      gsap.to("[data-pulse]", {
        scale: 1.7,
        opacity: 0,
        duration: 2.4,
        ease: "power2.out",
        repeat: -1,
        stagger: 0.8,
      });
      gsap.to("[data-orbit]", {
        rotate: 360,
        duration: 32,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-b border-border bg-bg-base"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-32 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-16 md:px-10 md:pb-28 md:pt-40">
        <div>
          <div data-rev className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-accent-primary" />
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
              Contact
            </p>
          </div>

          <h1 data-rev className="text-display-xl leading-[0.95]">
            <span className="block">Hai să</span>
            <span className="font-serif italic text-accent-primary">
              vorbim.
            </span>
          </h1>

          <span
            data-rule
            className="mt-6 block h-[2px] w-40 bg-accent-primary"
          />

          <p
            data-rev
            className="mt-8 max-w-xl text-lg text-text-muted md:text-xl"
          >
            Telefon, WhatsApp, sau formularul de mai jos. Răspundem rapid, cu
            întrebări la obiect și o estimare onestă — fără promisiuni pe care
            nu le putem ține.
          </p>

          <div
            data-rev
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted"
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-primary" />
              </span>
              {SITE_CONTACT.responseWindow}
            </span>
            <span>{SITE_CONTACT.hours}</span>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div
            data-orbit
            className="absolute inset-0 rounded-full border border-border"
          />
          <div
            data-orbit
            className="absolute inset-[12%] rounded-full border border-border/60"
          />
          <div
            data-orbit
            className="absolute inset-[24%] rounded-full border border-border/40"
          />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              data-pulse
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-primary/60"
            />
            <div
              data-pulse
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-primary/60"
            />
            <div
              data-pulse
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-primary/60"
            />

            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-cta border border-accent-primary/40 shadow-[0_0_60px_-10px_rgba(200,16,46,0.6)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.4"
                stroke="currentColor"
                className="h-10 w-10 text-text-primary"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293a1.125 1.125 0 0 1-1.21.38a12.035 12.035 0 0 1-7.143-7.143a1.125 1.125 0 0 1 .38-1.21l1.293-.97c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 font-mono text-[10px] uppercase tracking-[0.3em] text-text-faint">
            {SITE_CONTACT.city} · {SITE_CONTACT.region}
          </div>
          <div className="absolute right-0 top-0 font-mono text-[10px] uppercase tracking-[0.3em] text-text-faint">
            44.43°N · 26.10°E
          </div>
        </div>
      </div>
    </section>
  );
}
