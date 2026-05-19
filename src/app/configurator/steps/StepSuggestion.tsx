"use client";
import { type Dispatch } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { getRuleById } from "../rules";
import { StepShell } from "../components/StepShell";
import type { Action, State } from "../types";

export function StepSuggestion({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const ruleId = state.pendingRuleId;
  const rule = ruleId ? getRuleById(ruleId) : null;

  if (!rule || !ruleId) {
    return (
      <StepShell title="Continuăm" onNext={() => dispatch({ type: "next" })}>
        <p className="text-text-secondary">Nicio recomandare activă.</p>
      </StepShell>
    );
  }

  const handleDecline = () => {
    dispatch({ type: "decline-rule", ruleId });
    dispatch({ type: "next" });
  };

  const handleAccept = () => {
    dispatch({
      type: "accept-rule",
      ruleId,
      rewrite: rule.then.rewriteAnswers,
    });
    dispatch({ type: "next" });
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pt-10 pb-32 sm:pt-16">
      <div className="flex items-center gap-2 text-accent-primary">
        <Lightbulb className="h-5 w-5" />
        <span className="text-sm font-medium uppercase tracking-wide">
          Recomandare
        </span>
      </div>
      <h1 className="mt-3 text-2xl font-medium text-text-primary sm:text-3xl">
        Avem o sugestie pentru tine
      </h1>
      <p className="mt-4 text-base text-text-secondary">{rule.then.message}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" size="md" onClick={handleDecline}>
          Continuă cu alegerea inițială
        </Button>
        <Button variant="primary" size="md" onClick={handleAccept}>
          Aplică recomandarea
        </Button>
      </div>
    </div>
  );
}
