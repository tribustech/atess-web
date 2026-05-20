"use client";
import { type Dispatch } from "react";
import { cn } from "@/lib/utils/cn";
import { StepShell } from "../components/StepShell";
import type { Action, ProjectType, Sport, State } from "../types";

type Preset = {
  label: string;
  sublabel?: string;
  length: number;
  width?: number;
};

function presetsFor(
  projectType: ProjectType | undefined,
  sport: Sport | undefined,
): Preset[] {
  switch (projectType) {
    case "pista-atletism":
      return [
        { label: "Interior", sublabel: "200 m", length: 200 },
        { label: "Antrenament", sublabel: "300 m", length: 300 },
        { label: "Standard", sublabel: "400 m", length: 400 },
      ];

    case "multisport":
      return [
        { label: "Baschet", sublabel: "28 × 15", length: 28, width: 15 },
        { label: "Volei", sublabel: "18 × 9", length: 18, width: 9 },
        { label: "Tenis", sublabel: "24 × 11", length: 24, width: 11 },
        { label: "Handbal", sublabel: "40 × 20", length: 40, width: 20 },
        { label: "Fotbal 5", sublabel: "25 × 15", length: 25, width: 15 },
        { label: "Fotbal 7", sublabel: "50 × 30", length: 50, width: 30 },
      ];

    case "teren-individual":
      switch (sport) {
        case "basket":
          return [
            { label: "Baschet", sublabel: "28 × 15", length: 28, width: 15 },
            { label: "3×3", sublabel: "15 × 11", length: 15, width: 11 },
          ];
        case "tenis":
          return [
            { label: "Tenis", sublabel: "24 × 11", length: 24, width: 11 },
            { label: "Cu zonă liberă", sublabel: "36 × 18", length: 36, width: 18 },
          ];
        case "fotbal":
          return [
            { label: "Fotbal 5", sublabel: "25 × 15", length: 25, width: 15 },
            { label: "Fotbal 7", sublabel: "50 × 30", length: 50, width: 30 },
            { label: "Fotbal 11", sublabel: "100 × 65", length: 100, width: 65 },
          ];
        case "volei":
          return [
            { label: "Volei", sublabel: "18 × 9", length: 18, width: 9 },
            { label: "Beach volei", sublabel: "16 × 8", length: 16, width: 8 },
          ];
        default:
          return [
            { label: "Baschet", sublabel: "28 × 15", length: 28, width: 15 },
            { label: "Volei", sublabel: "18 × 9", length: 18, width: 9 },
            { label: "Tenis", sublabel: "24 × 11", length: 24, width: 11 },
            { label: "Fotbal 5", sublabel: "25 × 15", length: 25, width: 15 },
          ];
      }

    case "loc-joaca":
      return [
        { label: "Mic", sublabel: "~100 m²", length: 10, width: 10 },
        { label: "Mediu", sublabel: "~225 m²", length: 15, width: 15 },
        { label: "Mare", sublabel: "~400 m²", length: 20, width: 20 },
      ];

    case "spatii-publice":
      return [
        { label: "Miniteren", sublabel: "~300 m²", length: 20, width: 15 },
        { label: "Zonă comunală", sublabel: "~600 m²", length: 30, width: 20 },
        { label: "Parc", sublabel: "~1200 m²", length: 40, width: 30 },
      ];

    case "interior":
    case "constructii-cheie":
      return [
        { label: "Spațiu mic", sublabel: "~50 m²", length: 10, width: 5 },
        { label: "Mediu", sublabel: "~150 m²", length: 15, width: 10 },
        { label: "Mare", sublabel: "~500 m²", length: 25, width: 20 },
      ];

    default:
      return [];
  }
}

export function StepDimensions({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const { length, width, totalM2, projectType, sport } = state.answers;
  const lengthOnly = projectType === "pista-atletism";
  const presets = presetsFor(projectType, sport);

  const ready = lengthOnly
    ? typeof length === "number" && length > 0
    : typeof length === "number" &&
      length > 0 &&
      typeof width === "number" &&
      width > 0;

  const applyPreset = (p: Preset) => {
    dispatch({ type: "set", key: "length", value: p.length });
    dispatch({ type: "set", key: "width", value: p.width });
  };

  return (
    <StepShell
      title={lengthOnly ? "Lungimea pistei" : "Dimensiunile suprafeței"}
      subtitle={
        lengthOnly
          ? "În metri liniari. Alege un preset sau introdu valoarea."
          : "În metri. Alege un preset sau introdu valorile manual."
      }
      onBack={() => dispatch({ type: "back" })}
      onNext={() => dispatch({ type: "next" })}
      nextDisabled={!ready}
    >
      {presets.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
            {lengthOnly ? "Lungimi uzuale" : "Dimensiuni uzuale"}
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => {
              const active =
                length === p.length &&
                (p.width === undefined ? width === undefined : width === p.width);
              return (
                <button
                  key={`${p.label}-${p.length}-${p.width ?? "x"}`}
                  type="button"
                  onClick={() => applyPreset(p)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition",
                    active
                      ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                      : "border-border bg-bg-elevated text-text-secondary hover:border-text-faint hover:text-text-primary",
                  )}
                >
                  <span className="font-medium">{p.label}</span>
                  {p.sublabel && (
                    <span className="text-xs opacity-70">{p.sublabel}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-text-secondary">Lungime (m)</span>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            max={5000}
            step="0.1"
            placeholder={lengthOnly ? "ex: 400" : "ex: 44"}
            value={length ?? ""}
            onChange={(e) =>
              dispatch({
                type: "set",
                key: "length",
                value: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
            className="mt-1 block w-full rounded border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder:text-text-secondary/50 focus:border-accent-primary focus:outline-none"
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
              placeholder="ex: 22"
              value={width ?? ""}
              onChange={(e) =>
                dispatch({
                  type: "set",
                  key: "width",
                  value: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder:text-text-secondary/50 focus:border-accent-primary focus:outline-none"
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
