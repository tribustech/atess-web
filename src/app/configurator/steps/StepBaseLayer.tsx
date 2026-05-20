"use client";
import { type Dispatch } from "react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, BaseLayer, State } from "../types";

const OPTIONS: { value: BaseLayer; label: string; description?: string }[] = [
  { value: "beton", label: "Beton existent" },
  { value: "asfalt", label: "Asfalt existent" },
  { value: "pamant", label: "Pământ / pietriș" },
  { value: "niciuna", label: "Nicio fundație", description: "Construim noi de la zero." },
  { value: "nu-stiu", label: "Nu știu sigur" },
];

export function StepBaseLayer({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const selected = state.answers.baseLayer;
  return (
    <StepShell
      title="Ce ai ca strat suport?"
      subtitle="Fundația schimbă timpul și costul proiectului."
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
              dispatch({ type: "set", key: "baseLayer", value: opt.value })
            }
          />
        ))}
      </div>
    </StepShell>
  );
}
