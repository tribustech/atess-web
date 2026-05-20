"use client";
import { type Dispatch } from "react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, Context, State } from "../types";

const OPTIONS: { value: Context; label: string; description: string }[] = [
  {
    value: "privat-supervizat",
    label: "Privat, supravegheat",
    description: "Grădiniță privată, club, școală cu reguli — utilizare controlată.",
  },
  {
    value: "public-supervizat",
    label: "Public, supravegheat",
    description: "Spațiu public cu pază/reguli — terenuri școlare, complexe sportive.",
  },
  {
    value: "public-nesupervizat",
    label: "Public, nesupravegheat",
    description: "Parc deschis 24/7 — biciclete, role, trafic mixt.",
  },
];

export function StepContext({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const selected = state.answers.context;
  return (
    <StepShell
      title="Cum va fi spațiul folosit?"
      subtitle="Reglementarea schimbă complet ce sistem se potrivește."
      onBack={() => dispatch({ type: "back" })}
      onNext={() => dispatch({ type: "next" })}
      nextDisabled={!selected}
    >
      <div className="grid gap-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={selected === opt.value}
            onSelect={() =>
              dispatch({ type: "set", key: "context", value: opt.value })
            }
          />
        ))}
      </div>
    </StepShell>
  );
}
