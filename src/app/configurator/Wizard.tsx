"use client";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { configuratorReducer, initialState } from "./state";
import { evaluateRules } from "./rules";
import type { Action, ContactFields, State, StepId } from "./types";
import { StepProjectType } from "./steps/StepProjectType";
import { StepSport } from "./steps/StepSport";
import { StepDimensions } from "./steps/StepDimensions";
import { StepUsers } from "./steps/StepUsers";
import { StepContext } from "./steps/StepContext";
import { StepInteriorEnv } from "./steps/StepInteriorEnv";
import { StepTurnkeyBrief } from "./steps/StepTurnkeyBrief";
import { StepBaseLayer } from "./steps/StepBaseLayer";
import { StepTimeline } from "./steps/StepTimeline";
import { StepContact } from "./steps/StepContact";
import { StepThanks } from "./steps/StepThanks";
import { ProgressBar } from "./components/ProgressBar";
import { RecommendationHint } from "./components/RecommendationHint";

const STEP_INDEX: Record<StepId, number> = {
  "project-type": 1,
  sport: 2,
  dimensions: 3,
  users: 3,
  "interior-env": 3,
  "turnkey-brief": 3,
  context: 4,
  "base-layer": 5,
  timeline: 6,
  contact: 7,
  thanks: 8,
};

const RULE_GATES: StepId[] = ["context", "users", "interior-env", "dimensions", "base-layer"];

export function Wizard() {
  const [state, dispatch] = useReducer(configuratorReducer, initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Detect rule-gate transitions: when leaving a gate, evaluate rules.
  const previousStep = useRef<StepId>(state.current);
  useEffect(() => {
    const prev = previousStep.current;
    previousStep.current = state.current;
    if (prev === state.current) return;
    if (state.pendingRuleId) return;
    if (!RULE_GATES.includes(prev)) return;
    const matched = evaluateRules(state.answers, state.firedRules);
    if (matched) {
      dispatch({ type: "rule-fired", ruleId: matched.id });
    }
  }, [state.current, state.answers, state.firedRules, state.pendingRuleId]);

  const submit = useCallback(
    async (contact: ContactFields, files: File[], honeypot: string) => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const fd = new FormData();
        fd.append(
          "payload",
          JSON.stringify({
            answers: state.answers,
            originalAnswers: state.originalAnswers,
            acceptedRule: state.acceptedRule,
            contact,
            website: honeypot,
          }),
        );
        for (const f of files) fd.append("files", f, f.name);
        const res = await fetch("/api/configurator/submit", {
          method: "POST",
          body: fd,
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          code?: string;
        };
        if (!res.ok || !data.ok) {
          if (res.status === 429) {
            setSubmitError("Prea multe cereri. Încearcă din nou peste o oră.");
          } else if (res.status === 413) {
            setSubmitError(
              "Atașamentele sunt prea mari. Trimite-le separat pe email.",
            );
          } else if (data.code === "not_configured") {
            setSubmitError(
              "Configuratorul este momentan indisponibil. Te rugăm să ne contactezi direct la /contact.",
            );
          } else {
            setSubmitError(
              "Ceva nu a funcționat la trimitere. Te rugăm să ne contactezi direct la /contact.",
            );
          }
          return;
        }
        dispatch({ type: "next" });
      } catch {
        setSubmitError(
          "Trimitere eșuată. Verifică conexiunea și încearcă din nou.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [state.answers, state.originalAnswers, state.acceptedRule],
  );

  return (
    <>
      <ProgressBar current={STEP_INDEX[state.current]} total={8} />
      <RecommendationHint pendingRuleId={state.pendingRuleId} dispatch={dispatch} />
      <AnimatePresence mode="wait">
        <motion.div
          key={state.current}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {renderStep(state, dispatch, submit, submitting, submitError)}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function renderStep(
  state: State,
  dispatch: React.Dispatch<Action>,
  submit: (c: ContactFields, files: File[], honeypot: string) => void,
  submitting: boolean,
  submitError: string | null,
) {
  switch (state.current) {
    case "project-type":
      return <StepProjectType state={state} dispatch={dispatch} />;
    case "sport":
      return <StepSport state={state} dispatch={dispatch} />;
    case "dimensions":
      return <StepDimensions state={state} dispatch={dispatch} />;
    case "users":
      return <StepUsers state={state} dispatch={dispatch} />;
    case "context":
      return <StepContext state={state} dispatch={dispatch} />;
    case "interior-env":
      return <StepInteriorEnv state={state} dispatch={dispatch} />;
    case "turnkey-brief":
      return <StepTurnkeyBrief state={state} dispatch={dispatch} />;
    case "base-layer":
      return <StepBaseLayer state={state} dispatch={dispatch} />;
    case "timeline":
      return <StepTimeline state={state} dispatch={dispatch} />;
    case "contact":
      return (
        <StepContact
          state={state}
          dispatch={dispatch}
          submitting={submitting}
          submitError={submitError}
          onSubmit={submit}
        />
      );
    case "thanks":
      return <StepThanks state={state} dispatch={dispatch} />;
  }
}
