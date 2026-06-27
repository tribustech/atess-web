/**
 * Mega-menu representative photos.
 *
 * One photo per service category, shown as a small thumbnail in the "Servicii"
 * mega-menu (see ServicesMegaMenu). These replaced the previous 3-D previews —
 * 3-D models now live only on the individual system pages, not in navigation.
 *
 * Swapping a photo: drop a new file at the same path in
 * `public/images/services/menu/<slug>.webp` (or change the `src` below).
 * The current files are placeholder stock photos and are meant to be replaced
 * with real ATESS project photography.
 */
import type { ServiceSlug } from "@/lib/services";

export interface MegaMenuImage {
  src: string;
  alt: string;
}

const BASE = "/images/services/menu";

export const MEGA_MENU_IMAGES: Record<ServiceSlug, MegaMenuImage> = {
  "sport-outdoor": {
    src: `${BASE}/sport-outdoor.webp`,
    alt: "Pistă de atletism și teren sportiv în exterior",
  },
  "locuri-joaca": {
    src: `${BASE}/locuri-joaca.webp`,
    alt: "Loc de joacă cu suprafață sigură pentru copii",
  },
  "pardoseli-piatra": {
    src: `${BASE}/pardoseli-piatra.webp`,
    alt: "Covor de piatră pe liant rășinos pentru alei și terase",
  },
  "alei-pietonale": {
    src: `${BASE}/alei-pietonale.webp`,
    alt: "Alee pietonală amenajată într-un spațiu verde",
  },
  "sport-indoor": {
    src: `${BASE}/sport-indoor.webp`,
    alt: "Sală de sport cu pardoseală sportivă de interior",
  },
  mocheta: {
    src: `${BASE}/mocheta.webp`,
    alt: "Mochetă pentru spații de interior",
  },
  "pvc-linoleum": {
    src: `${BASE}/pvc-linoleum.webp`,
    alt: "Pardoseală PVC pentru spații cu trafic intens",
  },
  lvt: {
    src: `${BASE}/lvt.webp`,
    alt: "Pardoseală LVT cu aspect de lemn pentru interior",
  },
};

/** Returns the representative menu photo for a service slug. */
export function getMegaMenuImage(slug: ServiceSlug): MegaMenuImage {
  return MEGA_MENU_IMAGES[slug];
}
