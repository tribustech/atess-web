"use client";
import { type Dispatch } from "react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, State, Users } from "../types";

const OPTIONS: { value: Users; label: string; description?: string }[] = [
  { value: "copii-mici", label: "Copii mici (sub 12 ani)" },
  { value: "copii-mari", label: "Copii mari (12-16 ani)" },
  { value: "adolescenti", label: "Adolescenți / liceeni" },
  { value: "adulti", label: "Adulți" },
  { value: "mixt", label: "Mixt / public general" },
];

export function StepUsers({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const selected = state.answers.users;
  return (
    <StepShell
      title="Cine va folosi suprafața?"
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
              dispatch({ type: "set", key: "users", value: opt.value })
            }
          />
        ))}
      </div>
    </StepShell>
  );
}
