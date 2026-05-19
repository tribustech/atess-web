"use client";
import { type Dispatch, type ReactNode } from "react";
import {
  Activity,
  Construction,
  Home,
  TreePine,
  Trophy,
} from "lucide-react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, ProjectType, State } from "../types";

type Option = {
  value: ProjectType;
  label: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  icon?: ReactNode;
};

const OPTIONS: Option[] = [
  {
    value: "pista-atletism",
    label: "Pistă de atletism",
    description: "Stadioane, baze sportive, certificare World Athletics.",
    imageSrc: "/images/0e01084f-219e-4431-883e-c299b9bcb3f1-thumb.webp",
    imageAlt: "Pistă de atletism roșie cu marcaje World Athletics",
  },
  {
    value: "multisport",
    label: "Teren multisport / bază CNI",
    description: "Baschet, volei, tenis, handbal — un singur teren pentru toate.",
    icon: <Trophy className="h-7 w-7" />,
  },
  {
    value: "teren-individual",
    label: "Teren individual de sport",
    description: "Un sport anume — baschet, tenis, fotbal etc.",
    icon: <Activity className="h-7 w-7" />,
  },
  {
    value: "loc-joaca",
    label: "Loc de joacă",
    description: "Creșe, grădinițe, parcuri, zone safe pentru copii.",
    imageSrc: "/images/playgrounds/playground-01-thumb.webp",
    imageAlt: "Loc de joacă pentru copii cu pardoseală EPDM",
  },
  {
    value: "spatii-publice",
    label: "Spațiu public / gazon sintetic",
    description: "Miniterenuri comunale, parcuri, amenajări urbane.",
    icon: <TreePine className="h-7 w-7" />,
  },
  {
    value: "interior",
    label: "Pardoseală interioară",
    description: "PVC, LVT, linoleum, mochetă — birouri, spitale, comercial.",
    icon: <Home className="h-7 w-7" />,
  },
  {
    value: "constructii-cheie",
    label: "Construcție la cheie",
    description: "De la concept la predare — ne ocupăm de tot.",
    icon: <Construction className="h-7 w-7" />,
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
            imageSrc={opt.imageSrc}
            imageAlt={opt.imageAlt}
            icon={opt.icon}
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
