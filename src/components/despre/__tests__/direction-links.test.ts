import { describe, it, expect } from "vitest";
import { PILLARS } from "../PillarsGrid";
import { SERVICE_SLUGS, getServiceBySlug } from "@/lib/services";

describe("Despre direction cards — link invariant", () => {
  it("exposes at least four directions", () => {
    expect(PILLARS.length).toBeGreaterThanOrEqual(4);
  });

  it("every card has a non-empty internal href", () => {
    for (const p of PILLARS) {
      expect(p.href, `${p.title} missing href`).toBeTruthy();
      expect(p.href.startsWith("/"), `${p.title} href must be internal`).toBe(true);
    }
  });

  it("every /servicii/<slug> href uses a slug that exists in SERVICE_SLUGS", () => {
    for (const p of PILLARS) {
      if (p.href.startsWith("/servicii/")) {
        const slug = p.href.slice("/servicii/".length);
        expect(
          (SERVICE_SLUGS as readonly string[]).includes(slug),
          `"${p.title}" href "${p.href}" — slug "${slug}" is not in SERVICE_SLUGS`
        ).toBe(true);
        expect(
          getServiceBySlug(slug),
          `"${p.title}" href "${p.href}" — getServiceBySlug("${slug}") returned undefined`
        ).toBeDefined();
      } else {
        expect(p.href, `"${p.title}" href must be "/proiecte" if not /servicii/`).toBe("/proiecte");
      }
    }
  });
});
