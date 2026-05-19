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
      { type: "goto", step: "suggestion" },
    ]);
    expect(s.current).toBe("suggestion");
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
});
