"use client";
import { type Dispatch } from "react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, Sport, State } from "../types";

const OPTIONS: { value: Sport; label: string; description?: string }[] = [
  { value: "basket", label: "Baschet" },
  { value: "tenis", label: "Tenis" },
  { value: "fotbal", label: "Fotbal" },
  { value: "volei", label: "Volei" },
  { value: "multi", label: "Mai multe sporturi" },
  { value: "altele", label: "Altele / nu sunt sigur" },
];

export function StepSport({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const selected = state.answers.sport;
  return (
    <StepShell
      title="Ce sport practici pe teren?"
      subtitle="Ne ajută să recomandăm grosimea și sistemul potrivit."
      onBack={() => dispatch({ type: "back" })}
      onNext={() => dispatch({ type: "next" })}
      nextDisabled={!selected}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={selected === opt.value}
            onSelect={() =>
              dispatch({ type: "set", key: "sport", value: opt.value })
            }
          />
        ))}
      </div>
    </StepShell>
  );
}
