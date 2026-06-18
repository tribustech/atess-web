/**
 * Services accessor library — Plan C, Task 2
 *
 * Single source of truth for the 8 service categories defined in
 * src/data/services.json. Validates the JSON with Zod at module load time so
 * any data-shape mismatch is caught at build / test time, not at runtime.
 *
 * Exported names are stable across Plans C, D, F, G — do NOT rename without
 * updating all downstream consumers.
 */
import { z } from "zod";
import type { FlooringSystemId } from "@/components/home/FlooringSystem";
import servicesRaw from "@/data/services.json";

// ─── Zod schema ──────────────────────────────────────────────────────────────

const FLOORING_SYSTEM_IDS = [
  "sport-outdoor",
  "sport-indoor",
  "locuri-joaca",
  "pardoseli-piatra",
] as const satisfies FlooringSystemId[];

const SERVICE_SLUGS_TUPLE = [
  "sport-outdoor",
  "locuri-joaca",
  "pardoseli-piatra",
  "alei-pietonale",
  "sport-indoor",
  "mocheta",
  "pvc-linoleum",
  "lvt",
] as const;

/** All valid service slugs — tuple literal for exhaustiveness checks */
export const SERVICE_SLUGS: readonly ServiceSlug[] = SERVICE_SLUGS_TUPLE;

const RELATED_PROJECT_CATEGORIES = [
  "piste-atletism",
  "multisport",
  "locuri-joaca",
  "spatii-publice",
  "interioare",
  "constructii-cheie",
] as const;

const layerPhotoSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string(),
  placeholder: z.boolean(),
});

const seoCopySectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

const categorySchema = z.object({
  slug: z.enum(SERVICE_SLUGS_TUPLE),
  /** "Exterior" | "Interior" — capitalised as stored in JSON */
  group: z.enum(["Exterior", "Interior"]),
  order: z.number().int().positive(),
  label: z.string().min(1),
  shortBlurb: z.string().min(1),
  intro: z.string().min(1),
  seoCopy: z.array(seoCopySectionSchema),
  applications: z.array(z.string()),
  isSport: z.boolean(),
  /** Only present on the 4 categories that have a 3-D model */
  model3dId: z.enum(FLOORING_SYSTEM_IDS).optional(),
  layerPhoto: layerPhotoSchema,
  relatedProjectCategory: z.enum(RELATED_PROJECT_CATEGORIES),
  relatedArticleSlugs: z.array(z.string()),
});

// Validates all records at module load — throws if data shape is wrong
const categories = z.array(categorySchema).parse(servicesRaw);

// ─── Exported types ───────────────────────────────────────────────────────────

/** One of the 8 service category slugs */
export type ServiceSlug = (typeof SERVICE_SLUGS_TUPLE)[number];

/** Capitalised group as stored in JSON ("Exterior" | "Interior") */
export type ServiceGroup = "Exterior" | "Interior";

/** Lower-case axis alias — used by Plans D, F, G for ergonomic string comparisons */
export type ServiceAxis = "exterior" | "interior";

/** One SEO copy section inside a service category */
export type ServiceSeoSection = z.infer<typeof seoCopySectionSchema>;

/** Layer-photo metadata */
export type ServiceLayerPhoto = z.infer<typeof layerPhotoSchema>;

/** A fully-validated service category record */
export type ServiceCategory = z.infer<typeof categorySchema>;

/** Valid relatedProjectCategory slugs */
export type RelatedProjectCategory =
  (typeof RELATED_PROJECT_CATEGORIES)[number];

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Human-readable group labels keyed by capitalised ServiceGroup.
 * Plans D / F use this to render group headings.
 */
export const GROUP_LABEL: Record<ServiceGroup, string> = {
  Exterior: "Exterior",
  Interior: "Interior",
};

/**
 * Human-readable axis labels keyed by lowercase ServiceAxis.
 * Brief-specified export name — keep stable.
 */
export const AXIS_LABEL: Record<ServiceAxis, string> = {
  exterior: "Exterior",
  interior: "Interior",
};

// ─── Accessors ────────────────────────────────────────────────────────────────

/**
 * Returns all 8 service categories sorted: Exterior before Interior,
 * then by ascending `order` within each group.
 */
export function getAllServices(): ServiceCategory[] {
  return [...categories].sort((a, b) => {
    if (a.group !== b.group) return a.group.localeCompare(b.group); // "Exterior" < "Interior"
    return a.order - b.order;
  });
}

/**
 * Alias required by the brief — identical to getAllServices().
 * Plans C / D import this name directly.
 */
export function getAllCategories(): ServiceCategory[] {
  return getAllServices();
}

/**
 * Returns a single service category by slug, or `undefined` if not found.
 */
export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

/**
 * Alias required by the brief — identical to getServiceBySlug().
 */
export function getCategory(slug: string): ServiceCategory | undefined {
  return getServiceBySlug(slug);
}

/**
 * Returns all categories in a given capitalised group, sorted by `order`.
 */
export function getServicesByGroup(): Record<ServiceGroup, ServiceCategory[]> {
  const result: Record<ServiceGroup, ServiceCategory[]> = {
    Exterior: [],
    Interior: [],
  };
  for (const cat of categories) {
    result[cat.group].push(cat);
  }
  result.Exterior.sort((a, b) => a.order - b.order);
  result.Interior.sort((a, b) => a.order - b.order);
  return result;
}

/**
 * getCategoriesByAxis — brief-specified name; accepts lowercase axis string.
 */
export function getCategoriesByAxis(axis: ServiceAxis): ServiceCategory[] {
  const group: ServiceGroup =
    axis === "exterior" ? "Exterior" : "Interior";
  return categories
    .filter((c) => c.group === group)
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns the model3dId for the given slug, or undefined if the category has
 * no 3-D model. Used by the MegaMenu hover preview (Plan D).
 */
export function getMegaMenuModelId(
  slug: string,
): FlooringSystemId | undefined {
  return getServiceBySlug(slug)?.model3dId;
}
