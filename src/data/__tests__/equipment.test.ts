import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { EQUIPMENT_ITEMS } from "../equipment";
import { equipmentItemsSchema } from "../equipment.schema";

describe("EQUIPMENT_ITEMS", () => {
  it("satisfies the schema", () => {
    expect(() => equipmentItemsSchema.parse(EQUIPMENT_ITEMS)).not.toThrow();
  });

  it("has exactly one van and one team item", () => {
    expect(EQUIPMENT_ITEMS.filter((i) => i.kind === "van")).toHaveLength(1);
    expect(EQUIPMENT_ITEMS.filter((i) => i.kind === "team")).toHaveLength(1);
  });

  it("has at least four machine items", () => {
    expect(
      EQUIPMENT_ITEMS.filter((i) => i.kind === "machine").length
    ).toBeGreaterThanOrEqual(4);
  });

  it("every image src points to an existing file in public/", () => {
    for (const item of EQUIPMENT_ITEMS) {
      const path = resolve(__dirname, "../../../public", item.src.slice(1));
      expect(existsSync(path), `${item.id}: ${item.src} missing`).toBe(true);
    }
  });
});
