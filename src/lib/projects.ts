import { z } from "zod";
import projectsRaw from "@/data/projects.json";
import { PROJECT_CATEGORIES, type ProjectCategory } from "@/lib/gallery";

const CATEGORY_SLUGS = PROJECT_CATEGORIES.map((c) => c.slug) as [
  ProjectCategory,
  ...ProjectCategory[],
];

const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  locationCity: z.string().min(1),
  locationJudet: z.string().min(1),
  year: z.number().int().gte(2000).lte(2100),
  category: z.enum(CATEGORY_SLUGS),
  systemSlug: z.string().min(1),
  surfaceM2: z.number().positive(),
  client: z.string().optional(),
  description: z.string().min(1),
  whatWeDid: z.array(z.string().min(1)).min(1),
  heroImage: z.string().min(1),
  images: z.array(z.string().min(1)).min(1),
  featured: z.boolean().optional(),
});

export type Project = z.infer<typeof projectSchema>;

// Validate at module load — throws at startup if data is malformed.
const projects: Project[] = z.array(projectSchema).parse(projectsRaw);

// ---------------------------------------------------------------------------
// Basic accessors
// ---------------------------------------------------------------------------

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

// ---------------------------------------------------------------------------
// Grouped by canonical category (all 6; empty categories are excluded)
// ---------------------------------------------------------------------------

export function getProjectsGroupedByCategory(): Array<{
  category: ProjectCategory;
  label: string;
  projects: Project[];
}> {
  return PROJECT_CATEGORIES.map(({ slug, label }) => ({
    category: slug,
    label,
    projects: projects.filter((p) => p.category === slug),
  })).filter((g) => g.projects.length > 0);
}

// ---------------------------------------------------------------------------
// Featured projects
// ---------------------------------------------------------------------------

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured === true);
}

// ---------------------------------------------------------------------------
// Query-param resolver: /proiecte?categorie=<slug>
// Returns undefined if the slug is not one of the canonical 6 → show all.
// ---------------------------------------------------------------------------

export function resolveCategorieParam(
  value: string | undefined | null,
): ProjectCategory | undefined {
  if (!value) return undefined;
  const match = PROJECT_CATEGORIES.find((c) => c.slug === value);
  return match?.slug;
}

// ---------------------------------------------------------------------------
// Județ (county) utilities
// Short codes match ISO 3166-2:RO WITHOUT the "RO-" prefix, consistent with
// locationJudet in projects.json and the name="…" attributes in RomaniaMAP.svg.
// ---------------------------------------------------------------------------

export const JUDET_LABELS: Record<string, string> = {
  AB: "Alba",
  AR: "Arad",
  AG: "Argeș",
  BC: "Bacău",
  BH: "Bihor",
  BN: "Bistrița-Năsăud",
  BT: "Botoșani",
  BV: "Brașov",
  BR: "Brăila",
  BZ: "Buzău",
  CS: "Caraș-Severin",
  CL: "Călărași",
  CJ: "Cluj",
  CT: "Constanța",
  CV: "Covasna",
  DB: "Dâmbovița",
  DJ: "Dolj",
  GL: "Galați",
  GR: "Giurgiu",
  GJ: "Gorj",
  HR: "Harghita",
  HD: "Hunedoara",
  IL: "Ialomița",
  IS: "Iași",
  IF: "Ilfov",
  MM: "Maramureș",
  MH: "Mehedinți",
  MS: "Mureș",
  NT: "Neamț",
  OT: "Olt",
  PH: "Prahova",
  SM: "Satu Mare",
  SJ: "Sălaj",
  SB: "Sibiu",
  SV: "Suceava",
  TR: "Teleorman",
  TM: "Timiș",
  TL: "Tulcea",
  VS: "Vaslui",
  VL: "Vâlcea",
  VN: "Vrancea",
  B: "București",
};

export function getProjectsByJudet(judetCode: string): Project[] {
  return projects.filter((p) => p.locationJudet === judetCode);
}

export function getJudetProjectCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of projects) {
    counts[p.locationJudet] = (counts[p.locationJudet] ?? 0) + 1;
  }
  return counts;
}
