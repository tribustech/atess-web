/**
 * Tests for src/lib/services.ts — Plan C, Task 2
 *
 * These tests verify REAL data invariants against services.json,
 * not just type-level correctness.
 */
import { describe, it, expect } from "vitest";
import {
  getAllServices,
  getAllCategories,
  getServiceBySlug,
  getCategory,
  getServicesByGroup,
  getCategoriesByAxis,
  getMegaMenuModelId,
  SERVICE_SLUGS,
} from "../services";

const FLOORING_SYSTEM_IDS = [
  "sport-outdoor",
  "sport-indoor",
  "locuri-joaca",
  "pardoseli-piatra",
] as const;

const RELATED_PROJECT_CATEGORIES = [
  "piste-atletism",
  "multisport",
  "locuri-joaca",
  "spatii-publice",
  "interioare",
  "constructii-cheie",
] as const;

// ─── Schema validation at parse time ─────────────────────────────────────────

describe("services.json Zod validation", () => {
  it("parses all 8 categories without throwing", () => {
    // If Zod parse failed the module would have thrown at import;
    // reaching this line means validation passed.
    const all = getAllServices();
    expect(all).toHaveLength(8);
  });
});

// ─── SERVICE_SLUGS constant ───────────────────────────────────────────────────

describe("SERVICE_SLUGS", () => {
  it("contains exactly 8 slugs", () => {
    expect(SERVICE_SLUGS).toHaveLength(8);
  });

  it("all slugs are unique", () => {
    const slugSet = new Set(SERVICE_SLUGS);
    expect(slugSet.size).toBe(SERVICE_SLUGS.length);
  });

  it("every slug in SERVICE_SLUGS corresponds to a real category", () => {
    for (const slug of SERVICE_SLUGS) {
      const cat = getServiceBySlug(slug);
      expect(cat, `No category found for slug "${slug}"`).toBeDefined();
    }
  });
});

// ─── getAllServices / getAllCategories ────────────────────────────────────────

describe("getAllServices()", () => {
  it("returns 8 categories", () => {
    expect(getAllServices()).toHaveLength(8);
  });

  it("is sorted Exterior before Interior, then by order within group", () => {
    const all = getAllServices();
    const exteriorItems = all.filter((c) => c.group === "Exterior");
    const interiorItems = all.filter((c) => c.group === "Interior");

    // All Exterior items appear before any Interior item
    const lastExteriorIdx = all.findLastIndex((c) => c.group === "Exterior");
    const firstInteriorIdx = all.findIndex((c) => c.group === "Interior");
    expect(lastExteriorIdx).toBeLessThan(firstInteriorIdx);

    // Within Exterior, order is ascending
    for (let i = 1; i < exteriorItems.length; i++) {
      expect(exteriorItems[i].order).toBeGreaterThan(exteriorItems[i - 1].order);
    }

    // Within Interior, order is ascending
    for (let i = 1; i < interiorItems.length; i++) {
      expect(interiorItems[i].order).toBeGreaterThan(interiorItems[i - 1].order);
    }
  });
});

describe("getAllCategories()", () => {
  it("is an alias for getAllServices() — same length and slugs", () => {
    const a = getAllServices().map((c) => c.slug);
    const b = getAllCategories().map((c) => c.slug);
    expect(a).toEqual(b);
  });
});

// ─── getServicesByGroup ───────────────────────────────────────────────────────

describe("getServicesByGroup()", () => {
  it("returns exactly 4 Exterior and 4 Interior categories", () => {
    const grouped = getServicesByGroup();
    expect(grouped.Exterior).toHaveLength(4);
    expect(grouped.Interior).toHaveLength(4);
  });

  it("Exterior group is ordered by ascending `order`", () => {
    const { Exterior } = getServicesByGroup();
    for (let i = 1; i < Exterior.length; i++) {
      expect(Exterior[i].order).toBeGreaterThan(Exterior[i - 1].order);
    }
  });

  it("Interior group is ordered by ascending `order`", () => {
    const { Interior } = getServicesByGroup();
    for (let i = 1; i < Interior.length; i++) {
      expect(Interior[i].order).toBeGreaterThan(Interior[i - 1].order);
    }
  });

  it("Exterior slugs are correct", () => {
    const { Exterior } = getServicesByGroup();
    const slugs = Exterior.map((c) => c.slug);
    expect(slugs).toContain("sport-outdoor");
    expect(slugs).toContain("locuri-joaca");
    expect(slugs).toContain("pardoseli-piatra");
    expect(slugs).toContain("alei-pietonale");
  });

  it("Interior slugs are correct", () => {
    const { Interior } = getServicesByGroup();
    const slugs = Interior.map((c) => c.slug);
    expect(slugs).toContain("sport-indoor");
    expect(slugs).toContain("mocheta");
    expect(slugs).toContain("pvc-linoleum");
    expect(slugs).toContain("lvt");
  });
});

// ─── getCategoriesByAxis ──────────────────────────────────────────────────────

describe("getCategoriesByAxis()", () => {
  it("returns 4 exterior categories", () => {
    expect(getCategoriesByAxis("exterior")).toHaveLength(4);
  });

  it("returns 4 interior categories", () => {
    expect(getCategoriesByAxis("interior")).toHaveLength(4);
  });

  it("all returned exterior categories have group Exterior", () => {
    for (const cat of getCategoriesByAxis("exterior")) {
      expect(cat.group).toBe("Exterior");
    }
  });

  it("all returned interior categories have group Interior", () => {
    for (const cat of getCategoriesByAxis("interior")) {
      expect(cat.group).toBe("Interior");
    }
  });
});

// ─── getServiceBySlug / getCategory ──────────────────────────────────────────

describe("getServiceBySlug()", () => {
  it("finds sport-outdoor by slug", () => {
    const cat = getServiceBySlug("sport-outdoor");
    expect(cat).toBeDefined();
    expect(cat?.slug).toBe("sport-outdoor");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getServiceBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    expect(getServiceBySlug("")).toBeUndefined();
  });
});

describe("getCategory()", () => {
  it("is an alias for getServiceBySlug()", () => {
    const a = getServiceBySlug("mocheta");
    const b = getCategory("mocheta");
    expect(a).toEqual(b);
  });

  it("pvc-linoleum label matches real data", () => {
    const cat = getCategory("pvc-linoleum");
    expect(cat?.label).toBe("Covor PVC / Linoleum / Tapet PVC");
  });
});

// ─── model3dId invariants ─────────────────────────────────────────────────────

describe("model3dId", () => {
  it("every model3dId (when present) is a valid FlooringSystemId", () => {
    for (const cat of getAllServices()) {
      if (cat.model3dId !== undefined) {
        expect(
          (FLOORING_SYSTEM_IDS as readonly string[]).includes(cat.model3dId),
          `"${cat.model3dId}" is not a valid FlooringSystemId`,
        ).toBe(true);
      }
    }
  });

  it("exactly 4 categories have a model3dId", () => {
    const withModel = getAllServices().filter((c) => c.model3dId !== undefined);
    expect(withModel).toHaveLength(4);
  });

  it("the 4 categories with model3dId are sport-outdoor, sport-indoor, locuri-joaca, pardoseli-piatra", () => {
    const withModel = getAllServices()
      .filter((c) => c.model3dId !== undefined)
      .map((c) => c.slug)
      .sort();
    expect(withModel).toEqual(
      ["locuri-joaca", "pardoseli-piatra", "sport-indoor", "sport-outdoor"],
    );
  });
});

// ─── getMegaMenuModelId ───────────────────────────────────────────────────────

describe("getMegaMenuModelId()", () => {
  it("returns 'sport-outdoor' for slug 'sport-outdoor'", () => {
    expect(getMegaMenuModelId("sport-outdoor")).toBe("sport-outdoor");
  });

  it("returns 'sport-indoor' for slug 'sport-indoor'", () => {
    expect(getMegaMenuModelId("sport-indoor")).toBe("sport-indoor");
  });

  it("returns 'locuri-joaca' for slug 'locuri-joaca'", () => {
    expect(getMegaMenuModelId("locuri-joaca")).toBe("locuri-joaca");
  });

  it("returns 'pardoseli-piatra' for slug 'pardoseli-piatra'", () => {
    expect(getMegaMenuModelId("pardoseli-piatra")).toBe("pardoseli-piatra");
  });

  it("returns undefined for a category without a 3-D model", () => {
    expect(getMegaMenuModelId("alei-pietonale")).toBeUndefined();
    expect(getMegaMenuModelId("mocheta")).toBeUndefined();
    expect(getMegaMenuModelId("pvc-linoleum")).toBeUndefined();
    expect(getMegaMenuModelId("lvt")).toBeUndefined();
  });

  it("returns undefined for an unknown slug", () => {
    expect(getMegaMenuModelId("unknown")).toBeUndefined();
  });
});

// ─── relatedProjectCategory invariants ───────────────────────────────────────

describe("relatedProjectCategory", () => {
  it("every relatedProjectCategory is one of the 6 known GalleryCategory slugs", () => {
    for (const cat of getAllServices()) {
      expect(
        (RELATED_PROJECT_CATEGORIES as readonly string[]).includes(
          cat.relatedProjectCategory,
        ),
        `"${cat.relatedProjectCategory}" on slug "${cat.slug}" is not a known GalleryCategory`,
      ).toBe(true);
    }
  });
});

// ─── Data integrity ───────────────────────────────────────────────────────────

describe("data integrity", () => {
  it("all slugs across categories are unique", () => {
    const all = getAllServices();
    const slugs = all.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("all order values are unique", () => {
    const all = getAllServices();
    const orders = all.map((c) => c.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("every category has a non-empty label", () => {
    for (const cat of getAllServices()) {
      expect(cat.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("every layerPhoto has a non-empty src and alt", () => {
    for (const cat of getAllServices()) {
      expect(cat.layerPhoto.src.trim().length).toBeGreaterThan(0);
      expect(cat.layerPhoto.alt.trim().length).toBeGreaterThan(0);
    }
  });
});
