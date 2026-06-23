/**
 * Service subcategories — the third IA level under each category.
 *
 * The Servicii IA has two structural axes (Exterior / Interior) → 8 categories
 * (see lib/services). This module adds a lightweight third level of
 * subcategories per category, surfaced as:
 *   - quick sub-links in the "Servicii" mega-menu (desktop + mobile), and
 *   - anchored sections on each category page (/servicii/[slug]#<id>).
 *
 * These are NOT separate routes — each `id` is an in-page anchor on the
 * category page. Sport categories use sport-type subcategories (the plan
 * requires sports to split by type, like pardoselisport.ro); the remaining
 * categories use their application/use-case breakdown.
 *
 * Copy is in formal Romanian register — keep it professional (no slang).
 */
import type { ServiceSlug } from "@/lib/services";

export interface ServiceSubcategory {
  /** In-page anchor id on the category page (kebab-case, ASCII). */
  id: string;
  /** Short label shown in the mega-menu and as the section heading. */
  label: string;
  /** One-sentence descriptor shown on the category page section. */
  blurb: string;
}

export const SERVICE_SUBCATEGORIES: Record<ServiceSlug, ServiceSubcategory[]> = {
  "sport-outdoor": [
    {
      id: "terenuri-tenis",
      label: "Terenuri de tenis",
      blurb:
        "Suprafețe acrilice și sintetice cu aderență uniformă, omologate pentru joc de performanță și recreativ.",
    },
    {
      id: "terenuri-multisport",
      label: "Terenuri multisport",
      blurb:
        "Sisteme rezistente pentru baschet, handbal și volei, cu marcaje multiple pe aceeași suprafață.",
    },
    {
      id: "piste-atletism",
      label: "Piste de atletism",
      blurb:
        "Învelișuri din granule de cauciuc conforme World Athletics, cu elasticitate și drenaj controlate.",
    },
    {
      id: "terenuri-fotbal",
      label: "Terenuri de fotbal",
      blurb:
        "Gazon sintetic și sisteme elastice pentru terenuri de fotbal și antrenament, durabile la trafic intens.",
    },
  ],
  "locuri-joaca": [
    {
      id: "gradinite-crese",
      label: "Grădinițe și creșe",
      blurb:
        "Suprafețe sigure, certificate pentru atenuarea căderilor, potrivite mediilor pentru copii mici.",
    },
    {
      id: "parcuri-publice",
      label: "Parcuri publice",
      blurb:
        "Pardoseli durabile și colorate pentru spații de joacă publice, rezistente la intemperii și trafic ridicat.",
    },
    {
      id: "rezidential",
      label: "Spații rezidențiale",
      blurb:
        "Soluții personalizate pentru curți și ansambluri rezidențiale, sigure și ușor de întreținut.",
    },
  ],
  "pardoseli-piatra": [
    {
      id: "alei-terase",
      label: "Alei și terase",
      blurb:
        "Covoare de piatră drenante și decorative pentru alei, terase și zone pietonale.",
    },
    {
      id: "zone-piscina",
      label: "Zone de piscină",
      blurb:
        "Suprafețe antiderapante și confortabile pentru plajele de piscină și zonele umede.",
    },
    {
      id: "amenajari-peisagistice",
      label: "Amenajări peisagistice",
      blurb:
        "Finisaje naturale care integrează suprafețele pietonale în amenajări exterioare.",
    },
  ],
  "alei-pietonale": [
    {
      id: "circulatii-parcuri",
      label: "Circulații în parcuri",
      blurb:
        "Alei rezistente pentru circulația pietonală în parcuri și spații verzi.",
    },
    {
      id: "trotuare",
      label: "Trotuare amenajate",
      blurb:
        "Suprafețe durabile și sigure pentru trotuare și zone de promenadă.",
    },
    {
      id: "spatii-institutionale",
      label: "Spații instituționale",
      blurb:
        "Pardoseli exterioare pentru incinte instituționale și spații publice.",
    },
  ],
  "sport-indoor": [
    {
      id: "sali-sport",
      label: "Săli de sport",
      blurb:
        "Pardoseli sportive pentru săli școlare și universitare, cu absorbție de șoc și rezistență la trafic intens.",
    },
    {
      id: "terenuri-indoor",
      label: "Baschet și volei",
      blurb:
        "Suprafețe punctiforme și mixte pentru jocuri sportive de interior, cu aderență și confort la impact.",
    },
    {
      id: "multifunctional",
      label: "Spații multifuncționale",
      blurb:
        "Sisteme versatile pentru spații care combină sportul cu evenimente și activități recreative.",
    },
    {
      id: "fitness",
      label: "Săli de fitness",
      blurb:
        "Pardoseli rezistente la greutăți și abraziune, cu amortizare pentru zonele de antrenament.",
    },
  ],
  mocheta: [
    {
      id: "birouri",
      label: "Birouri corporate",
      blurb:
        "Mochetă în plăci pentru birouri, cu confort acustic și montaj modular ușor de întreținut.",
    },
    {
      id: "comercial",
      label: "Spații comerciale",
      blurb:
        "Soluții rezistente la trafic intens pentru spații comerciale și de retail.",
    },
    {
      id: "hoteluri",
      label: "Hoteluri",
      blurb:
        "Mochetă cu aspect premium și fonoabsorbție pentru spații hoteliere.",
    },
  ],
  "pvc-linoleum": [
    {
      id: "medical",
      label: "Unități medicale",
      blurb:
        "Pardoseli PVC și linoleum igienice, antibacteriene și ușor de dezinfectat pentru spații medicale.",
    },
    {
      id: "educational",
      label: "Spații educaționale",
      blurb:
        "Suprafețe rezistente și sigure pentru școli, grădinițe și universități.",
    },
    {
      id: "comercial",
      label: "Spații comerciale",
      blurb:
        "Pardoseli durabile pentru spații comerciale cu trafic ridicat.",
    },
  ],
  lvt: [
    {
      id: "rezidential-premium",
      label: "Rezidențial premium",
      blurb:
        "Plăci LVT cu aspect natural de lemn sau piatră, confortabile și rezistente pentru locuințe.",
    },
    {
      id: "showroom",
      label: "Showroom-uri",
      blurb:
        "Finisaje elegante și durabile pentru showroom-uri și spații de prezentare.",
    },
    {
      id: "birouri",
      label: "Birouri",
      blurb:
        "Pardoseli LVT cu montaj rapid și întreținere redusă pentru spații de lucru.",
    },
  ],
};

/** Returns the subcategories for a service slug (never undefined). */
export function getServiceSubcategories(
  slug: ServiceSlug,
): ServiceSubcategory[] {
  return SERVICE_SUBCATEGORIES[slug] ?? [];
}
