import { describe, expect, it } from "vitest";
import {
  getManufacturers,
  getLeadManufacturer,
  getClients,
} from "@/lib/partners";

describe("getManufacturers", () => {
  it("returns exactly the five manufacturers", () => {
    const slugs = getManufacturers().map((m) => m.slug);
    expect(slugs).toEqual([
      "stockmeier",
      "doctor-schutz",
      "tarkett",
      "balta",
      "ivc",
    ]);
  });

  it("is sorted ascending by rank", () => {
    const ranks = getManufacturers().map((m) => m.rank);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it("marks exactly one lead and it is Stockmeier", () => {
    const leads = getManufacturers().filter((m) => m.lead);
    expect(leads).toHaveLength(1);
    expect(leads[0].slug).toBe("stockmeier");
  });

  it("every manufacturer has description, url and logo", () => {
    for (const m of getManufacturers()) {
      expect(m.description.length).toBeGreaterThan(0);
      expect(m.url).toMatch(/^https?:\/\//);
      expect(m.logo).toMatch(/^\/logos\//);
    }
  });

  it("excludes clients from the result", () => {
    const types = getManufacturers().map((m) => m.type);
    expect(types.every((t) => t === "manufacturer")).toBe(true);
  });
});

describe("getLeadManufacturer", () => {
  it("returns Stockmeier", () => {
    expect(getLeadManufacturer().slug).toBe("stockmeier");
  });

  it("has lead flag set to true", () => {
    expect(getLeadManufacturer().lead).toBe(true);
  });
});

describe("getClients", () => {
  it("returns only client entries", () => {
    const types = getClients().map((c) => c.type);
    expect(types.every((t) => t === "client")).toBe(true);
  });

  it("returns a non-empty list", () => {
    expect(getClients().length).toBeGreaterThan(0);
  });
});

describe("Zod schema validation", () => {
  it("partners.json validates without throwing (imports succeed)", () => {
    // If the module loaded without error, the Zod parse at module-load time passed.
    expect(getManufacturers().length).toBeGreaterThan(0);
  });
});
