import type { ServiceSlug } from "@/lib/services";

export interface HeroSlide {
  src: string;
  eyebrow: string;
  caption: string;
  href: string;
}

// Ensure every service href uses a canonical ServiceSlug at compile time
function serviceHref(slug: ServiceSlug): string {
  return `/servicii/${slug}`;
}

export const heroSlides: HeroSlide[] = [
  {
    src: "/images/1.webp",
    eyebrow: "Pardoseli sportive outdoor",
    caption: "Piste de atletism și terenuri multisport executate la standarde de competiție.",
    href: serviceHref("sport-outdoor"),
  },
  {
    src: "/images/2.webp",
    eyebrow: "Locuri de joacă",
    caption: "Suprafețe sigure, certificate pentru atenuarea căderilor.",
    href: serviceHref("locuri-joaca"),
  },
  {
    src: "/images/5.webp",
    eyebrow: "Pardoseli sportive indoor",
    caption: "Săli de sport cu sisteme rezistente la trafic intens.",
    href: serviceHref("sport-indoor"),
  },
  {
    src: "/images/3.webp",
    eyebrow: "Covor PVC și LVT",
    caption: "Pardoseli de interior pentru spații cu cerințe ridicate de igienă și durabilitate.",
    href: serviceHref("pvc-linoleum"),
  },
  {
    src: "/images/4.webp",
    eyebrow: "Proiecte livrate",
    caption: "Peste 500 de proiecte finalizate în toată țara.",
    href: "/proiecte",
  },
];

export const heroVideo = "/video/hero.mp4";
