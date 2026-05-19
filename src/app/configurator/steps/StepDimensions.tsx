"use client";
import { type Dispatch } from "react";
import { StepShell } from "../components/StepShell";
import type { Action, State } from "../types";

export function StepDimensions({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const { length, width, totalM2, projectType } = state.answers;
  const lengthOnly = projectType === "pista-atletism";

  const ready = lengthOnly
    ? typeof length === "number" && length > 0
    : typeof length === "number" &&
      length > 0 &&
      typeof width === "number" &&
      width > 0;

  return (
    <StepShell
      title={lengthOnly ? "Lungimea pistei" : "Dimensiunile suprafeței"}
      subtitle={lengthOnly ? "În metri liniari." : "În metri."}
      onBack={() => dispatch({ type: "back" })}
      onNext={() => dispatch({ type: "next" })}
      nextDisabled={!ready}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-text-secondary">Lungime (m)</span>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            max={5000}
            step="0.1"
            value={length ?? ""}
            onChange={(e) =>
              dispatch({
                type: "set",
                key: "length",
                value: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
            className="mt-1 block w-full rounded border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-primary focus:outline-none"
          />
        </label>
        {!lengthOnly && (
          <label className="block">
            <span className="text-sm text-text-secondary">Lățime (m)</span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={500}
              step="0.1"
              value={width ?? ""}
              onChange={(e) =>
                dispatch({
                  type: "set",
                  key: "width",
                  value: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-primary focus:outline-none"
            />
          </label>
        )}
      </div>
      {!lengthOnly && typeof totalM2 === "number" && (
        <p className="mt-4 text-sm text-text-secondary">
          Aproximativ <span className="text-text-primary">{totalM2} m²</span>.
        </p>
      )}
    </StepShell>
  );
}
