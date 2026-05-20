import { describe, it, expect } from "vitest";
import { evaluateRules } from "../rules";
import type { Answers } from "../types";

const fired = (ids: string[] = []) => ids;

describe("evaluateRules", () => {
  it("matches basket-kids-to-playground", () => {
    const answers: Answers = {
      projectType: "teren-individual",
      sport: "basket",
      users: "copii-mici",
    };
    const rule = evaluateRules(answers, fired());
    expect(rule?.id).toBe("basket-kids-to-playground");
  });

  it("matches public-basket-mixed-use", () => {
    const answers: Answers = {
      projectType: "teren-individual",
      sport: "basket",
      context: "public-nesupervizat",
    };
    const rule = evaluateRules(answers, fired());
    expect(rule?.id).toBe("public-basket-mixed-use");
  });

  it("matches gradinita-privata-pluta", () => {
    const answers: Answers = {
      projectType: "loc-joaca",
      context: "privat-supervizat",
      users: "copii-mici",
    };
    const rule = evaluateRules(answers, fired());
    expect(rule?.id).toBe("gradinita-privata-pluta");
  });

  it("matches pista-sub-400m using lengthBelow threshold", () => {
    const answers: Answers = { projectType: "pista-atletism", length: 200 };
    const rule = evaluateRules(answers, fired());
    expect(rule?.id).toBe("pista-sub-400m");
  });

  it("does not match pista-sub-400m at exactly 400m", () => {
    const answers: Answers = { projectType: "pista-atletism", length: 400 };
    expect(evaluateRules(answers, fired())?.id).not.toBe("pista-sub-400m");
  });

  it("matches proiect-sub-100m using totalM2Below threshold", () => {
    const answers: Answers = { totalM2: 50 };
    expect(evaluateRules(answers, fired())?.id).toBe("proiect-sub-100m");
  });

  it("matches fara-fundatie", () => {
    expect(evaluateRules({ baseLayer: "niciuna" }, fired())?.id).toBe(
      "fara-fundatie",
    );
  });

  it("skips rules already in firedRules", () => {
    const answers: Answers = {
      projectType: "teren-individual",
      sport: "basket",
      users: "copii-mici",
    };
    const rule = evaluateRules(answers, fired(["basket-kids-to-playground"]));
    expect(rule).toBeNull();
  });

  it("returns null when no rule matches", () => {
    expect(evaluateRules({ projectType: "multisport" }, fired())).toBeNull();
  });
});
