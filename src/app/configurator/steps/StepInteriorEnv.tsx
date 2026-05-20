"use client";
import { type Dispatch, type ReactNode } from "react";
import {
  Briefcase,
  GraduationCap,
  Home,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, State, UseCase } from "../types";

type Option = {
  value: UseCase;
  label: string;
  description?: string;
  icon: ReactNode;
};

const OPTIONS: Option[] = [
  {
    value: "spital",
    label: "Spital / unitate medicală",
    description: "PVC medical, antibacterian.",
    icon: <Stethoscope className="h-7 w-7" />,
  },
  {
    value: "birou",
    label: "Birou / spațiu corporate",
    icon: <Briefcase className="h-7 w-7" />,
  },
  {
    value: "comercial",
    label: "Spațiu comercial",
    icon: <ShoppingBag className="h-7 w-7" />,
  },
  {
    value: "educational",
    label: "Spațiu educațional",
    description: "Școli, grădinițe, universități.",
    icon: <GraduationCap className="h-7 w-7" />,
  },
  {
    value: "locuinta",
    label: "Locuință",
    icon: <Home className="h-7 w-7" />,
  },
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
            icon={opt.icon}
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
