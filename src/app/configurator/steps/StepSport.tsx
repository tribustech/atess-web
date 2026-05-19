"use client";
import { type Dispatch, type ReactNode } from "react";
import {
  CircleDot,
  Goal,
  HelpCircle,
  Target,
  Trophy,
  Volleyball,
} from "lucide-react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, Sport, State } from "../types";

type Option = {
  value: Sport;
  label: string;
  description?: string;
  icon: ReactNode;
};

const OPTIONS: Option[] = [
  { value: "basket", label: "Baschet", icon: <CircleDot className="h-7 w-7" /> },
  { value: "tenis", label: "Tenis", icon: <Target className="h-7 w-7" /> },
  { value: "fotbal", label: "Fotbal", icon: <Goal className="h-7 w-7" /> },
  { value: "volei", label: "Volei", icon: <Volleyball className="h-7 w-7" /> },
  {
    value: "multi",
    label: "Mai multe sporturi",
    icon: <Trophy className="h-7 w-7" />,
  },
  {
    value: "altele",
    label: "Altele / nu sunt sigur",
    icon: <HelpCircle className="h-7 w-7" />,
  },
];

export function StepSport({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  const selected = state.answers.sport;
  return (
    <StepShell
      title="Ce sport practici pe teren?"
      subtitle="Ne ajută să recomandăm grosimea și sistemul potrivit."
      onBack={() => dispatch({ type: "back" })}
      onNext={() => dispatch({ type: "next" })}
      nextDisabled={!selected}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            icon={opt.icon}
            selected={selected === opt.value}
            onSelect={() =>
              dispatch({ type: "set", key: "sport", value: opt.value })
            }
          />
        ))}
      </div>
    </StepShell>
  );
}
