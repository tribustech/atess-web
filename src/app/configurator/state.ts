import type { Action, Answers, State } from "./types";
import { deriveNextStep } from "./step-graph";

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

export function configuratorReducer(state: State, action: Action): State {
  switch (action.type) {
    case "set": {
      const answers = applyAnswerSideEffects({
        ...state.answers,
        [action.key]: action.value,
      });
      return { ...state, answers };
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
      return { ...state, current, history };
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
