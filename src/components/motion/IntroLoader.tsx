"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLenis } from "./LenisProvider";

const SEEN_KEY = "atess_intro_seen";
const LOGO_SRC = "/images/logo-atess-intro.png";

// Geometry of logo-atess-intro.png (hi-res logo, ATESS wordmark recolored white,
// on a pure-black background; the
// backdrop below is pure black too so the logo's bg blends seamlessly).
const IMG_W = 1221;
const IMG_H = 1289;
const DCX = 608; // white diamond centre x
const DCY = 617; // white diamond centre y

const ORIGIN_X = (DCX / IMG_W) * 100; // 49.80%
const ORIGIN_Y = (DCY / IMG_H) * 100; // 47.87%

// Size by the viewport's smaller side so it never overflows, then offset so the
// diamond centre lands exactly on (50vw, 50vh) — the point we scale/iris from.
const SIZE = 44; // logo height in vmin
const HEIGHT_VMIN = SIZE;
const WIDTH_VMIN = (IMG_W / IMG_H) * SIZE;
const LEFT_OFFSET = (DCX / IMG_H) * SIZE; // diamond x from frame's left edge (vmin)
const TOP_OFFSET = (DCY / IMG_H) * SIZE; // diamond y from frame's top edge (vmin)

export function IntroLoader() {
  const lenis = useLenis();
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // Decide (client-only, pre-paint) whether to run. The inline bootstrap script
  // in layout.tsx adds `intro-active` to <html> only on a first, hard load of "/".
  useLayoutEffect(() => {
    const html = document.documentElement;
    const shouldRun =
      html.classList.contains("intro-active") &&
      !sessionStorage.getItem(SEEN_KEY);
    if (shouldRun) {
      setActive(true);
    } else {
      html.classList.remove("intro-active");
    }
  }, []);

  useLayoutEffect(() => {
    if (!active) return;
    const backdrop = backdropRef.current;
    const frame = frameRef.current;
    const logo = logoRef.current;
    const flash = flashRef.current;
    const root = rootRef.current;
    if (!backdrop || !frame || !logo || !flash || !root) return;

    const html = document.documentElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    lenis.stop();

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* private mode — fine, it'll just replay next load */
      }
      document.body.style.overflow = prevOverflow;
      lenis.start();
      html.classList.remove("intro-active");
      setActive(false);
    };

    const ctx = gsap.context(() => {
      gsap.set(backdrop, { autoAlpha: 1 });
      gsap.set(frame, {
        scale: 0.85,
        autoAlpha: 0,
        transformOrigin: `${ORIGIN_X}% ${ORIGIN_Y}%`,
      });
      gsap.set(flash, { autoAlpha: 0 });

      // Our overlay now covers the screen → drop the pre-paint CSS cover.
      html.classList.remove("intro-active");

      const intro = gsap.timeline();
      intro
        .to(frame, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out" })
        // gentle "breathing" hold so it never looks frozen while we wait
        .to(frame, { scale: 1.05, duration: 0.9, ease: "sine.inOut" }, ">");

      // Gate the dive on the page being ready, with a hard safety cap.
      const fontsReady =
        (document as Document & { fonts?: FontFaceSet }).fonts?.ready ??
        Promise.resolve();
      const windowLoaded =
        document.readyState === "complete"
          ? Promise.resolve()
          : new Promise<void>((resolve) =>
              window.addEventListener("load", () => resolve(), { once: true }),
            );
      const minHold = new Promise<void>((r) => window.setTimeout(r, 1150));
      const safetyCap = new Promise<void>((r) => window.setTimeout(r, 2500));

      Promise.race([
        Promise.all([fontsReady, windowLoaded, minHold]).then(() => undefined),
        safetyCap,
      ]).then(() => {
        if (done) return;
        gsap.killTweensOf([frame]);

        const dive = gsap.timeline({ onComplete: finish });
        // Fly into the white diamond — it grows toward the viewer and engulfs us.
        dive.to(frame, { scale: 12, duration: 0.95, ease: "power3.in" }, 0);
        // A soft white flash blooms (no hard edge) as the diamond swallows the screen.
        dive.to(flash, { autoAlpha: 1, duration: 0.45, ease: "power2.in" }, 0.5);
        // Fully white now — drop the dark scene behind it, then dissolve to the page.
        dive.add(() => {
          gsap.set([backdrop, frame], { autoAlpha: 0 });
        });
        dive.to(flash, { autoAlpha: 0, duration: 0.55, ease: "power2.out" }, "+=0.04");
      });
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = prevOverflow;
      lenis.start();
    };
  }, [active, lenis]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
    >
      <div
        ref={backdropRef}
        style={{ position: "fixed", inset: 0, background: "#000000" }}
      />
      <div
        ref={frameRef}
        style={{
          position: "fixed",
          left: `calc(50vw - ${LEFT_OFFSET}vmin)`,
          top: `calc(50vh - ${TOP_OFFSET}vmin)`,
          width: `${WIDTH_VMIN}vmin`,
          height: `${HEIGHT_VMIN}vmin`,
          transformOrigin: `${ORIGIN_X}% ${ORIGIN_Y}%`,
          willChange: "transform, opacity",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          src={LOGO_SRC}
          alt=""
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
      {/* White flash — blooms to swallow the screen as we enter the diamond */}
      <div
        ref={flashRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "#ffffff",
          willChange: "opacity",
        }}
      />
    </div>
  );
}
