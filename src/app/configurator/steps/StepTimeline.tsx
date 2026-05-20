"use client";
import { type Dispatch } from "react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, State, Timeline } from "../types";

const OPTIONS: { value: Timeline; label: string }[] = [
  { value: "sub-3-luni", label: "Sub 3 luni" },
  { value: "3-12-luni", label: "3 - 12 luni" },
  { value: "peste-1-an", label: "Peste 1 an" },
  { value: "nu-stiu", label: "Nu știu încă" },
];

export function StepTimeline({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const selected = state.answers.timeline;
  return (
    <StepShell
      title="Când vrei să începem?"
      onBack={() => dispatch({ type: "back" })}
      onNext={() => dispatch({ type: "next" })}
      nextDisabled={!selected}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onSelect={() =>
              dispatch({ type: "set", key: "timeline", value: opt.value })
            }
          />
        ))}
      </div>
    </StepShell>
  );
}
