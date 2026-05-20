import rulesData from "@/data/configurator-rules.json";
import type { Answers } from "./types";

export type Rule = {
  id: string;
  if: Partial<Answers> & { lengthBelow?: number; totalM2Below?: number };
  then: {
    suggest: string;
    title?: string;
    message: string;
    detail?: string;
    rewriteAnswers?: Partial<Answers>;
  };
};

const RULES = rulesData as Rule[];

function matches(condition: Rule["if"], answers: Answers): boolean {
  for (const [key, value] of Object.entries(condition)) {
    if (key === "lengthBelow") {
      if (answers.length === undefined) return false;
      if (!(answers.length < (value as number))) return false;
      continue;
    }
    if (key === "totalM2Below") {
      if (answers.totalM2 === undefined) return false;
      if (!(answers.totalM2 < (value as number))) return false;
      continue;
    }
    if (answers[key as keyof Answers] !== value) return false;
  }
  return true;
}

export function evaluateRules(answers: Answers, firedRules: string[]): Rule | null {
  for (const rule of RULES) {
    if (firedRules.includes(rule.id)) continue;
    if (matches(rule.if, answers)) return rule;
  }
  return null;
}

export function getRuleById(id: string): Rule | undefined {
  return RULES.find((r) => r.id === id);
}

export function ruleMatches(rule: Rule, answers: Answers): boolean {
  return matches(rule.if, answers);
}
