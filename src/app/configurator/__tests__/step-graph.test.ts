import { describe, it, expect } from "vitest";
import { deriveNextStep } from "../step-graph";
import type { Answers } from "../types";

describe("deriveNextStep", () => {
  it("from project-type / pista-atletism -> dimensions (length only)", () => {
    expect(
      deriveNextStep("project-type", { projectType: "pista-atletism" } as Answers),
    ).toBe("dimensions");
  });

  it("from project-type / multisport -> dimensions", () => {
    expect(deriveNextStep("project-type", { projectType: "multisport" })).toBe(
      "dimensions",
    );
  });

  it("from project-type / teren-individual -> sport", () => {
    expect(deriveNextStep("project-type", { projectType: "teren-individual" })).toBe(
      "sport",
    );
  });

  it("from project-type / loc-joaca -> users", () => {
    expect(deriveNextStep("project-type", { projectType: "loc-joaca" })).toBe(
      "users",
    );
  });

  it("from project-type / spatii-publice -> dimensions", () => {
    expect(deriveNextStep("project-type", { projectType: "spatii-publice" })).toBe(
      "dimensions",
    );
  });

  it("from project-type / interior -> interior-env", () => {
    expect(deriveNextStep("project-type", { projectType: "interior" })).toBe(
      "interior-env",
    );
  });

  it("from project-type / constructii-cheie -> turnkey-brief", () => {
    expect(
      deriveNextStep("project-type", { projectType: "constructii-cheie" }),
    ).toBe("turnkey-brief");
  });

  it("teren-individual flow: sport -> dimensions -> users -> context", () => {
    const a: Answers = { projectType: "teren-individual", sport: "basket" };
    expect(deriveNextStep("sport", a)).toBe("dimensions");
    expect(deriveNextStep("dimensions", a)).toBe("users");
    expect(deriveNextStep("users", a)).toBe("context");
  });

  it("multisport: dimensions -> context", () => {
    const a: Answers = { projectType: "multisport" };
    expect(deriveNextStep("dimensions", a)).toBe("context");
  });

  it("loc-joaca: users -> context", () => {
    const a: Answers = { projectType: "loc-joaca" };
    expect(deriveNextStep("users", a)).toBe("context");
  });

  it("pista-atletism: dimensions -> base-layer (no context, no users)", () => {
    const a: Answers = { projectType: "pista-atletism" };
    expect(deriveNextStep("dimensions", a)).toBe("base-layer");
  });

  it("spatii-publice: dimensions -> base-layer", () => {
    const a: Answers = { projectType: "spatii-publice" };
    expect(deriveNextStep("dimensions", a)).toBe("base-layer");
  });

  it("interior: interior-env -> base-layer", () => {
    const a: Answers = { projectType: "interior" };
    expect(deriveNextStep("interior-env", a)).toBe("base-layer");
  });

  it("constructii-cheie: turnkey-brief -> contact", () => {
    const a: Answers = { projectType: "constructii-cheie" };
    expect(deriveNextStep("turnkey-brief", a)).toBe("contact");
  });

  it("after rules-eligible branches end, go to base-layer", () => {
    const a: Answers = { projectType: "multisport", context: "public-supervizat" };
    expect(deriveNextStep("context", a)).toBe("base-layer");
  });

  it("base-layer -> timeline", () => {
    const a: Answers = { projectType: "multisport" };
    expect(deriveNextStep("base-layer", a)).toBe("timeline");
  });

  it("timeline -> contact", () => {
    expect(deriveNextStep("timeline", { projectType: "multisport" })).toBe(
      "contact",
    );
  });

  it("contact -> thanks", () => {
    expect(deriveNextStep("contact", { projectType: "multisport" })).toBe(
      "thanks",
    );
  });

  it("thanks -> null (terminal)", () => {
    expect(deriveNextStep("thanks", {})).toBeNull();
  });
});
