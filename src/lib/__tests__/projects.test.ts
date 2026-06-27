import { describe, it, expect } from "vitest";
import { PROJECT_CATEGORIES, type ProjectCategory } from "@/lib/gallery";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectsGroupedByCategory,
  getFeaturedProjects,
  resolveCategorieParam,
  getProjectsByJudet,
  getJudetProjectCounts,
  JUDET_LABELS,
} from "@/lib/projects";

const VALID_CATEGORIES = PROJECT_CATEGORIES.map((c) => c.slug) as ProjectCategory[];

// ---------------------------------------------------------------------------
// Schema & data integrity
// ---------------------------------------------------------------------------

describe("projects.json — schema validation", () => {
  it("loads all 12 projects without throwing", () => {
    expect(() => getAllProjects()).not.toThrow();
    expect(getAllProjects()).toHaveLength(12);
  });

  it("every project has a non-empty slug", () => {
    for (const p of getAllProjects()) {
      expect(p.slug.length).toBeGreaterThan(0);
    }
  });

  it("every category value is one of the canonical 6", () => {
    for (const p of getAllProjects()) {
      expect(VALID_CATEGORIES).toContain(p.category);
    }
  });

  it("every year is a plausible integer", () => {
    for (const p of getAllProjects()) {
      expect(Number.isInteger(p.year)).toBe(true);
      expect(p.year).toBeGreaterThanOrEqual(2000);
      expect(p.year).toBeLessThanOrEqual(2100);
    }
  });

  it("every surfaceM2 is positive", () => {
    for (const p of getAllProjects()) {
      expect(p.surfaceM2).toBeGreaterThan(0);
    }
  });

  it("every whatWeDid array has at least one entry", () => {
    for (const p of getAllProjects()) {
      expect(p.whatWeDid.length).toBeGreaterThan(0);
    }
  });

  it("every images array has at least one entry", () => {
    for (const p of getAllProjects()) {
      expect(p.images.length).toBeGreaterThan(0);
    }
  });

  it("slugs are unique", () => {
    const slugs = getAllProjects().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

// ---------------------------------------------------------------------------
// getProjectBySlug
// ---------------------------------------------------------------------------

describe("getProjectBySlug", () => {
  it("returns the correct project for a known slug", () => {
    const p = getProjectBySlug("pista-fc-bacau");
    expect(p).toBeDefined();
    expect(p?.title).toBe("Pistă de atletism FC Bacău");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getProjectBySlug("")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getProjectsGroupedByCategory
// ---------------------------------------------------------------------------

describe("getProjectsGroupedByCategory", () => {
  it("returns only groups that have at least 1 project", () => {
    const groups = getProjectsGroupedByCategory();
    for (const g of groups) {
      expect(g.projects.length).toBeGreaterThan(0);
    }
  });

  it("every group key is one of the canonical 6 categories", () => {
    const groups = getProjectsGroupedByCategory();
    for (const g of groups) {
      expect(VALID_CATEGORIES).toContain(g.category);
    }
  });

  it("grouping is exhaustive — every project appears in exactly one group", () => {
    const groups = getProjectsGroupedByCategory();
    const allGroupedSlugs = groups.flatMap((g) => g.projects.map((p) => p.slug));
    const allSlugs = getAllProjects().map((p) => p.slug);
    expect(allGroupedSlugs.sort()).toEqual(allSlugs.sort());
  });

  it("constructii-cheie (0 projects) does not appear in the result", () => {
    const groups = getProjectsGroupedByCategory();
    const keys = groups.map((g) => g.category);
    expect(keys).not.toContain("constructii-cheie");
  });

  it("each group has the correct label from PROJECT_CATEGORIES", () => {
    const groups = getProjectsGroupedByCategory();
    for (const g of groups) {
      const expected = PROJECT_CATEGORIES.find((c) => c.slug === g.category)?.label;
      expect(g.label).toBe(expected);
    }
  });
});

// ---------------------------------------------------------------------------
// getFeaturedProjects
// ---------------------------------------------------------------------------

describe("getFeaturedProjects", () => {
  it("returns only projects with featured === true", () => {
    for (const p of getFeaturedProjects()) {
      expect(p.featured).toBe(true);
    }
  });

  it("returns at least 1 featured project", () => {
    expect(getFeaturedProjects().length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// resolveCategorieParam (query-param resolver)
// ---------------------------------------------------------------------------

describe("resolveCategorieParam", () => {
  it("returns the category for each of the 6 valid slugs", () => {
    for (const slug of VALID_CATEGORIES) {
      expect(resolveCategorieParam(slug)).toBe(slug);
    }
  });

  it("returns undefined for an invalid slug", () => {
    expect(resolveCategorieParam("invalid-slug")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(resolveCategorieParam("")).toBeUndefined();
  });

  it("returns undefined for undefined input", () => {
    expect(resolveCategorieParam(undefined)).toBeUndefined();
  });

  it("returns undefined for null input", () => {
    expect(resolveCategorieParam(null)).toBeUndefined();
  });

  it("is case-sensitive — mixed case is rejected", () => {
    expect(resolveCategorieParam("Piste-Atletism")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Județ helpers
// ---------------------------------------------------------------------------

describe("JUDET_LABELS", () => {
  it("contains all judet codes used in projects.json", () => {
    const projectCodes = new Set(getAllProjects().map((p) => p.locationJudet));
    for (const code of projectCodes) {
      expect(JUDET_LABELS[code], `JUDET_LABELS missing key "${code}"`).toBeDefined();
    }
  });

  it("contains entry for București (B)", () => {
    expect(JUDET_LABELS["B"]).toBe("București");
  });

  it("has non-empty labels for every key", () => {
    for (const [code, label] of Object.entries(JUDET_LABELS)) {
      expect(label.length, `Empty label for ${code}`).toBeGreaterThan(0);
    }
  });
});

describe("getProjectsByJudet", () => {
  it("returns projects for a code that has projects (B - București)", () => {
    const result = getProjectsByJudet("B");
    expect(result.length).toBeGreaterThan(0);
    for (const p of result) {
      expect(p.locationJudet).toBe("B");
    }
  });

  it("returns empty array for a code with no projects", () => {
    expect(getProjectsByJudet("AB")).toHaveLength(0);
  });

  it("returns empty array for an unknown code", () => {
    expect(getProjectsByJudet("XX")).toHaveLength(0);
  });
});

describe("getJudetProjectCounts", () => {
  it("total count equals total number of projects", () => {
    const counts = getJudetProjectCounts();
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(getAllProjects().length);
  });

  it("only references judet codes that exist in JUDET_LABELS", () => {
    const counts = getJudetProjectCounts();
    for (const code of Object.keys(counts)) {
      expect(JUDET_LABELS[code], `Count key "${code}" not in JUDET_LABELS`).toBeDefined();
    }
  });

  it("București (B) has more than 1 project", () => {
    const counts = getJudetProjectCounts();
    expect(counts["B"]).toBeGreaterThan(1);
  });
});
