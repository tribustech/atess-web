import type { Action, Answers, State } from "./types";
import { deriveNextStep } from "./step-graph";
import { getRuleById, ruleMatches } from "./rules";

export const initialState: State = {
  answers: {},
  history: [],
  current: "project-type",
  firedRules: [],
};

function applyAnswerSideEffects(answers: Answers): Answers {
  const next: Answers = { ...answers };
  if (typeof next.length === "number" && typeof next.width === "number") {
    next.totalM2 = Math.round(next.length * next.width);
  }
  return next;
}

function refreshRuleState(
  state: State,
  answers: Answers,
): Pick<State, "pendingRuleId" | "firedRules"> {
  let pendingRuleId = state.pendingRuleId;
  if (pendingRuleId) {
    const rule = getRuleById(pendingRuleId);
    if (!rule || !ruleMatches(rule, answers)) {
      pendingRuleId = undefined;
    }
  }
  // Drop fired rules that no longer match the new answers, so a
  // back+edit+forward cycle can re-evaluate them on the next gate.
  const firedRules = state.firedRules.filter((id) => {
    const rule = getRuleById(id);
    if (!rule) return false;
    return ruleMatches(rule, answers);
  });
  return { pendingRuleId, firedRules };
}

export function configuratorReducer(state: State, action: Action): State {
  switch (action.type) {
    case "set": {
      const answers = applyAnswerSideEffects({
        ...state.answers,
        [action.key]: action.value,
      });
      return { ...state, answers, ...refreshRuleState(state, answers) };
    }

    case "next": {
      const next = deriveNextStep(state.current, state.answers);
      if (!next) return state;
      return {
        ...state,
        current: next,
        history: [...state.history, state.current],
      };
    }

    case "back": {
      if (state.history.length === 0) return state;
      const history = state.history.slice(0, -1);
      const current = state.history[state.history.length - 1];
      return {
        ...state,
        current,
        history,
        pendingRuleId: undefined,
      };
    }

    case "goto":
      return {
        ...state,
        current: action.step,
        history: [...state.history, state.current],
      };

    case "rule-fired":
      return { ...state, pendingRuleId: action.ruleId };

    case "decline-rule":
      return {
        ...state,
        pendingRuleId: undefined,
        firedRules: state.firedRules.includes(action.ruleId)
          ? state.firedRules
          : [...state.firedRules, action.ruleId],
      };

    case "accept-rule": {
      const answers = applyAnswerSideEffects({
        ...state.answers,
        ...(action.rewrite ?? {}),
      });
      return {
        ...state,
        answers,
        originalAnswers: state.answers,
        acceptedRule: action.ruleId,
        firedRules: state.firedRules.includes(action.ruleId)
          ? state.firedRules
          : [...state.firedRules, action.ruleId],
        pendingRuleId: undefined,
      };
    }

    case "revert-rule": {
      if (!state.originalAnswers) return state;
      const ruleId = state.acceptedRule;
      return {
        ...state,
        answers: state.originalAnswers,
        originalAnswers: undefined,
        acceptedRule: undefined,
        firedRules: ruleId
          ? state.firedRules.filter((id) => id !== ruleId)
          : state.firedRules,
      };
    }

    case "set-contact":
      return { ...state, contact: action.contact };

    case "set-files":
      return { ...state, files: action.files };

    case "reset":
      return initialState;
  }
}
