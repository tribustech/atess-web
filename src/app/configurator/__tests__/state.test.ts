import { describe, it, expect } from "vitest";
import { configuratorReducer, initialState } from "../state";
import type { Action, ContactFields } from "../types";

function run(actions: Action[]) {
  return actions.reduce(configuratorReducer, initialState);
}

describe("configuratorReducer", () => {
  it("initial state starts on project-type with empty answers", () => {
    expect(initialState.current).toBe("project-type");
    expect(initialState.answers).toEqual({});
    expect(initialState.history).toEqual([]);
    expect(initialState.firedRules).toEqual([]);
  });

  it("'set' updates an answer key", () => {
    const s = configuratorReducer(initialState, {
      type: "set",
      key: "projectType",
      value: "multisport",
    });
    expect(s.answers.projectType).toBe("multisport");
  });

  it("'next' advances to the next step and pushes history", () => {
    const after = run([
      { type: "set", key: "projectType", value: "multisport" },
      { type: "next" },
    ]);
    expect(after.current).toBe("dimensions");
    expect(after.history).toEqual(["project-type"]);
  });

  it("'back' pops history and restores current", () => {
    const after = run([
      { type: "set", key: "projectType", value: "multisport" },
      { type: "next" },
      { type: "back" },
    ]);
    expect(after.current).toBe("project-type");
    expect(after.history).toEqual([]);
  });

  it("'back' at root is a no-op", () => {
    const s = configuratorReducer(initialState, { type: "back" });
    expect(s).toEqual(initialState);
  });

  it("computes totalM2 when length and width are set", () => {
    const s = run([
      { type: "set", key: "length", value: 44 },
      { type: "set", key: "width", value: 22 },
    ]);
    expect(s.answers.totalM2).toBe(968);
  });

  it("'rule-fired' records the pending rule", () => {
    const s = configuratorReducer(initialState, {
      type: "rule-fired",
      ruleId: "basket-kids-to-playground",
    });
    expect(s.pendingRuleId).toBe("basket-kids-to-playground");
  });

  it("'decline-rule' marks rule fired and clears pending", () => {
    const s = run([
      { type: "rule-fired", ruleId: "basket-kids-to-playground" },
      { type: "decline-rule", ruleId: "basket-kids-to-playground" },
    ]);
    expect(s.firedRules).toContain("basket-kids-to-playground");
    expect(s.pendingRuleId).toBeUndefined();
  });

  it("'accept-rule' snapshots original answers and applies rewrite", () => {
    const s = run([
      { type: "set", key: "projectType", value: "teren-individual" },
      { type: "set", key: "sport", value: "basket" },
      { type: "set", key: "users", value: "copii-mici" },
      { type: "rule-fired", ruleId: "basket-kids-to-playground" },
      {
        type: "accept-rule",
        ruleId: "basket-kids-to-playground",
        rewrite: { projectType: "loc-joaca" },
      },
    ]);
    expect(s.acceptedRule).toBe("basket-kids-to-playground");
    expect(s.originalAnswers?.projectType).toBe("teren-individual");
    expect(s.answers.projectType).toBe("loc-joaca");
    expect(s.firedRules).toContain("basket-kids-to-playground");
    expect(s.pendingRuleId).toBeUndefined();
  });

  it("'revert-rule' restores originalAnswers and removes acceptedRule from firedRules", () => {
    const s = run([
      { type: "set", key: "projectType", value: "teren-individual" },
      { type: "set", key: "sport", value: "basket" },
      { type: "set", key: "users", value: "copii-mici" },
      { type: "rule-fired", ruleId: "basket-kids-to-playground" },
      {
        type: "accept-rule",
        ruleId: "basket-kids-to-playground",
        rewrite: { projectType: "loc-joaca" },
      },
      { type: "revert-rule" },
    ]);
    expect(s.answers.projectType).toBe("teren-individual");
    expect(s.originalAnswers).toBeUndefined();
    expect(s.acceptedRule).toBeUndefined();
    expect(s.firedRules).not.toContain("basket-kids-to-playground");
  });

  it("'goto' pushes current to history and switches step", () => {
    const s = run([
      { type: "set", key: "projectType", value: "teren-individual" },
      { type: "next" },
      { type: "goto", step: "contact" },
    ]);
    expect(s.current).toBe("contact");
    expect(s.history).toContain("sport");
  });

  it("'set-contact' stores contact fields", () => {
    const contact: ContactFields = {
      name: "Ion",
      phone: "+40712345678",
      email: "ion@example.com",
      judet: "Cluj",
      deadline: "3-12-luni",
    };
    const s = configuratorReducer(initialState, { type: "set-contact", contact });
    expect(s.contact).toEqual(contact);
  });

  it("'reset' returns to initialState", () => {
    const s = run([
      { type: "set", key: "projectType", value: "multisport" },
      { type: "next" },
      { type: "reset" },
    ]);
    expect(s).toEqual(initialState);
  });

  it("'back' clears any pending recommendation", () => {
    const s = run([
      { type: "set", key: "projectType", value: "teren-individual" },
      { type: "next" },
      { type: "rule-fired", ruleId: "basket-kids-to-playground" },
      { type: "back" },
    ]);
    expect(s.pendingRuleId).toBeUndefined();
  });

  it("'set' clears a pending recommendation that no longer matches", () => {
    const s = run([
      { type: "set", key: "projectType", value: "teren-individual" },
      { type: "set", key: "sport", value: "basket" },
      { type: "set", key: "users", value: "copii-mici" },
      { type: "rule-fired", ruleId: "basket-kids-to-playground" },
      // Change one of the conditions — recommendation should disappear.
      { type: "set", key: "users", value: "adulti" },
    ]);
    expect(s.pendingRuleId).toBeUndefined();
  });

  it("'set' keeps a pending recommendation that still matches", () => {
    const s = run([
      { type: "set", key: "projectType", value: "teren-individual" },
      { type: "set", key: "sport", value: "basket" },
      { type: "set", key: "users", value: "copii-mici" },
      { type: "rule-fired", ruleId: "basket-kids-to-playground" },
      // Touch an unrelated field — rule still matches.
      { type: "set", key: "length", value: 20 },
    ]);
    expect(s.pendingRuleId).toBe("basket-kids-to-playground");
  });

  it("'set' drops fired rules whose preconditions no longer hold", () => {
    const s = run([
      { type: "set", key: "projectType", value: "teren-individual" },
      { type: "set", key: "sport", value: "basket" },
      { type: "set", key: "users", value: "copii-mici" },
      { type: "rule-fired", ruleId: "basket-kids-to-playground" },
      { type: "decline-rule", ruleId: "basket-kids-to-playground" },
      // User goes back and revises an input — rule should become re-eligible.
      { type: "set", key: "users", value: "adulti" },
    ]);
    expect(s.firedRules).not.toContain("basket-kids-to-playground");
  });

  it("'set' keeps fired rules whose preconditions are unchanged", () => {
    const s = run([
      { type: "set", key: "projectType", value: "teren-individual" },
      { type: "set", key: "sport", value: "basket" },
      { type: "set", key: "users", value: "copii-mici" },
      { type: "rule-fired", ruleId: "basket-kids-to-playground" },
      { type: "decline-rule", ruleId: "basket-kids-to-playground" },
      // Touch an unrelated field — declined rule stays declined.
      { type: "set", key: "length", value: 20 },
    ]);
    expect(s.firedRules).toContain("basket-kids-to-playground");
  });
});

describe("read / decline / accept tracking", () => {
  it("read-rule records the rule once", () => {
    let s = configuratorReducer(initialState, { type: "read-rule", ruleId: "r1" });
    s = configuratorReducer(s, { type: "read-rule", ruleId: "r1" });
    expect(s.readRules).toEqual(["r1"]);
  });

  it("decline-rule records both firedRules and declinedRules", () => {
    const s = configuratorReducer(initialState, {
      type: "decline-rule",
      ruleId: "r2",
    });
    expect(s.firedRules).toContain("r2");
    expect(s.declinedRules).toContain("r2");
    expect(s.pendingRuleId).toBeUndefined();
  });

  it("accept-rule marks the rule as read and applies the rewrite", () => {
    const seeded = { ...initialState, answers: { projectType: "teren-individual" as const } };
    const s = configuratorReducer(seeded, {
      type: "accept-rule",
      ruleId: "basket-kids-to-playground",
      rewrite: { projectType: "loc-joaca" },
    });
    expect(s.readRules).toContain("basket-kids-to-playground");
    expect(s.acceptedRule).toBe("basket-kids-to-playground");
    expect(s.answers.projectType).toBe("loc-joaca");
    expect(s.originalAnswers?.projectType).toBe("teren-individual");
  });

  it("reset clears read and declined rules", () => {
    let s = configuratorReducer(initialState, { type: "read-rule", ruleId: "r3" });
    s = configuratorReducer(s, { type: "reset" });
    expect(s.readRules).toEqual([]);
    expect(s.declinedRules).toEqual([]);
  });

  it("read-rule does not corrupt answers or other state", () => {
    const seeded = {
      ...initialState,
      answers: { projectType: "multisport" as const },
      firedRules: ["some-other-rule"],
    };
    const s = configuratorReducer(seeded, { type: "read-rule", ruleId: "r4" });
    expect(s.answers).toEqual(seeded.answers);
    expect(s.firedRules).toEqual(seeded.firedRules);
    expect(s.current).toBe(seeded.current);
  });
});
