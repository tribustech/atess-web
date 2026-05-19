"use client";
import { type Dispatch } from "react";
import { StepShell } from "../components/StepShell";
import type { Action, State } from "../types";

export function StepTurnkeyBrief({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const brief = state.answers.turnkeyBrief ?? "";
  const ready = brief.trim().length >= 10;
  return (
    <StepShell
      title="Ce ai și ce-ți dorești?"
      subtitle="Descrie pe scurt situația actuală și obiectivul. Reglementăm restul împreună."
      onBack={() => dispatch({ type: "back" })}
      onNext={() => dispatch({ type: "next" })}
      nextDisabled={!ready}
    >
      <textarea
        rows={6}
        value={brief}
        onChange={(e) =>
          dispatch({ type: "set", key: "turnkeyBrief", value: e.target.value })
        }
        placeholder="ex: am un teren de 1500m² lângă școala generală din comună, vreau un mini-teren multisport și o pistă de alergare în jurul lui"
        className="block w-full rounded border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder:text-text-secondary/50 focus:border-accent-primary focus:outline-none"
      />
    </StepShell>
  );
}
