"use client";
import { type Dispatch } from "react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, State, UseCase } from "../types";

const OPTIONS: { value: UseCase; label: string; description?: string }[] = [
  { value: "spital", label: "Spital / unitate medicală", description: "PVC medical, antibacterian." },
  { value: "birou", label: "Birou / spațiu corporate" },
  { value: "comercial", label: "Spațiu comercial" },
  { value: "educational", label: "Spațiu educațional", description: "Școli, grădinițe, universități." },
  { value: "locuinta", label: "Locuință" },
];

export function StepInteriorEnv({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const selected = state.answers.useCase;
  return (
    <StepShell
      title="Ce tip de spațiu interior?"
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
              dispatch({ type: "set", key: "useCase", value: opt.value })
            }
          />
        ))}
      </div>
    </StepShell>
  );
}
