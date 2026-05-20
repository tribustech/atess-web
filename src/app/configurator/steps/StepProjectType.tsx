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
    imageSrc: "/images/1505c0a0-d7e5-4532-ba42-f7bd950f290b-thumb.webp",
    imageAlt: "Pistă de atletism roșie cu marcaje World Athletics",
  },
  {
    value: "multisport",
    label: "Teren multisport / bază CNI",
    description: "Baschet, volei, tenis, handbal — un singur teren pentru toate.",
    imageSrc: "/images/164118d1-8139-4825-a273-8a9171480bad-thumb.webp",
    imageAlt: "Sală multisport interioară cu marcaje pentru baschet, volei și handbal",
    icon: <Trophy className="h-7 w-7" />,
  },
  {
    value: "teren-individual",
    label: "Teren individual de sport",
    description: "Un sport anume — baschet, tenis, fotbal etc.",
    imageSrc: "/images/784cc04b-0c84-4536-83cd-ec8d0f43053b-thumb.webp",
    imageAlt: "Teren individual de baschet cu suprafață acrilică albastră",
    icon: <Activity className="h-7 w-7" />,
  },
  {
    value: "loc-joaca",
    label: "Loc de joacă",
    description: "Creșe, grădinițe, parcuri, zone safe pentru copii.",
    imageSrc: "/images/abe3623c-096a-4d2b-a26d-410e472adeae-thumb.webp",
    imageAlt: "Loc de joacă în parc municipal cu pardoseală EPDM colorată",
    icon: <TreePine className="h-7 w-7" />,
  },
  {
    value: "spatii-publice",
    label: "Spațiu public / gazon sintetic",
    description: "Miniterenuri comunale, parcuri, amenajări urbane.",
    imageSrc: "/images/894c6fb2-df45-4d3d-bccd-bd09e1cc4fe7-thumb.webp",
    imageAlt: "Spațiu public amenajat cu gazon sintetic și inserții EPDM",
    icon: <TreePine className="h-7 w-7" />,
  },
  {
    value: "interior",
    label: "Pardoseală interioară",
    description: "PVC, LVT, linoleum, mochetă — birouri, spitale, comercial.",
    imageSrc: "/images/a88fa2a2-0478-43ec-9f83-87372c7de351-thumb.webp",
    imageAlt: "Pardoseală interioară polimerică într-un spațiu monolit albastru",
    icon: <Home className="h-7 w-7" />,
  },
  {
    value: "constructii-cheie",
    label: "Construcție la cheie",
    description: "De la concept la predare — ne ocupăm de tot.",
    imageSrc: "/images/606ae2ad-b1d7-4b8b-8427-65e3cee079bb-thumb.webp",
    imageAlt: "Aplicator Atess aplicând stratul final pe o pardoseală interioară",
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
