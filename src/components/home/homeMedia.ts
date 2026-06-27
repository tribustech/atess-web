import type { ServiceSlug } from "@/lib/services";

export type HeroTextPosition =
  | "bottom-left"
  | "center-left"
  | "bottom-right"
  | "center-right"
  | "center";

export interface HeroSlide {
  src: string;
  eyebrow: string;
  /** Headline split into lines; the last line is rendered in the accent colour. */
  headline: string[];
  caption: string;
  href: string;
  /** Label for the secondary CTA that links to `href` (contextual per slide). */
  cta: string;
  /** Where the text cluster sits in the hero for this slide. */
  position: HeroTextPosition;
}

// Ensure every service href uses a canonical ServiceSlug at compile time
function serviceHref(slug: ServiceSlug): string {
  return `/servicii/${slug}`;
}

export const heroSlides: HeroSlide[] = [
  {
    src: "/images/1.webp",
    eyebrow: "Pardoseli sportive outdoor",
    headline: ["Performanță", "în aer liber."],
    caption: "Piste de atletism și terenuri multisport executate la standarde de competiție.",
    href: serviceHref("sport-outdoor"),
    cta: "Vezi pardoseli outdoor",
    position: "bottom-left",
  },
  {
    src: "/images/2.webp",
    eyebrow: "Locuri de joacă",
    headline: ["Joacă", "în siguranță."],
    caption: "Suprafețe sigure, certificate pentru atenuarea căderilor.",
    href: serviceHref("locuri-joaca"),
    cta: "Vezi locuri de joacă",
    position: "bottom-right",
  },
  {
    src: "/images/5.webp",
    eyebrow: "Pardoseli sportive indoor",
    headline: ["Sport", "fără limite."],
    caption: "Săli de sport cu sisteme rezistente la trafic intens.",
    href: serviceHref("sport-indoor"),
    cta: "Vezi pardoseli indoor",
    position: "center-right",
  },
  {
    src: "/images/3.webp",
    eyebrow: "Covor PVC și LVT",
    headline: ["Interioare", "durabile."],
    caption: "Pardoseli de interior pentru spații cu cerințe ridicate de igienă și durabilitate.",
    href: serviceHref("pvc-linoleum"),
    cta: "Vezi covor PVC & LVT",
    position: "center-left",
  },
  {
    src: "/images/4.webp",
    eyebrow: "Proiecte livrate",
    headline: ["500+ proiecte", "în toată țara."],
    caption: "Peste 500 de proiecte finalizate în toată țara.",
    href: "/proiecte",
    cta: "Vezi proiectele",
    position: "center",
  },
];

export const heroVideo = "/video/hero.mp4";

/** Athletics-track hero clip (1080p, web-optimized) + its first-frame poster. */
export const heroTrackVideo = "/video/pista-atletism.mp4";
export const heroTrackPoster = "/images/hero-track-poster.webp";
