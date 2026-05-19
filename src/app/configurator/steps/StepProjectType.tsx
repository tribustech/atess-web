"use client";
import { type Dispatch } from "react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, ProjectType, State } from "../types";

const OPTIONS: { value: ProjectType; label: string; description: string }[] = [
  {
    value: "pista-atletism",
    label: "Pistă de atletism",
    description: "Stadioane, baze sportive, certificare World Athletics.",
  },
  {
    value: "multisport",
    label: "Teren multisport / bază CNI",
    description: "Baschet, volei, tenis, handbal — un singur teren pentru toate.",
  },
  {
    value: "teren-individual",
    label: "Teren individual de sport",
    description: "Un sport anume — baschet, tenis, fotbal etc.",
  },
  {
    value: "loc-joaca",
    label: "Loc de joacă",
    description: "Creșe, grădinițe, parcuri, zone safe pentru copii.",
  },
  {
    value: "spatii-publice",
    label: "Spațiu public / gazon sintetic",
    description: "Miniterenuri comunale, parcuri, amenajări urbane.",
  },
  {
    value: "interior",
    label: "Pardoseală interioară",
    description: "PVC, LVT, linoleum, mochetă — birouri, spitale, comercial.",
  },
  {
    value: "constructii-cheie",
    label: "Construcție la cheie",
    description: "De la concept la predare — ne ocupăm de tot.",
  },
];

export function StepProjectType({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const selected = state.answers.projectType;
  return (
    <StepShell
      title="Ce vrei să configurăm?"
      subtitle="Alege tipul de proiect — apoi te ghidăm cu întrebări potrivite."
      hideBack
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
              dispatch({ type: "set", key: "projectType", value: opt.value })
            }
          />
        ))}
      </div>
    </StepShell>
  );
}
