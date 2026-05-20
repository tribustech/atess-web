"use client";
import { type Dispatch, type ReactNode } from "react";
import { HelpCircle, Trophy, Volleyball } from "lucide-react";
import { StepShell } from "../components/StepShell";
import { OptionCard } from "../components/OptionCard";
import type { Action, Sport, State } from "../types";

const sharedSvgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function BasketballIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...sharedSvgProps} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M4.9 4.9c3.2 4.7 3.2 9.5 0 14.2" />
      <path d="M19.1 4.9c-3.2 4.7-3.2 9.5 0 14.2" />
    </svg>
  );
}

function TennisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...sharedSvgProps} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M5.6 6.4c3.2 2.6 9.6 2.6 12.8 0" />
      <path d="M5.6 17.6c3.2-2.6 9.6-2.6 12.8 0" />
    </svg>
  );
}

function SoccerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...sharedSvgProps} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12,7 8.4,9.6 9.7,13.8 14.3,13.8 15.6,9.6" />
      <path d="M12 2v5" />
      <path d="M8.4 9.6 3.6 8" />
      <path d="M15.6 9.6 20.4 8" />
      <path d="M9.7 13.8 7.4 18.6" />
      <path d="M14.3 13.8 16.6 18.6" />
    </svg>
  );
}

type Option = {
  value: Sport;
  label: string;
  description?: string;
  icon: ReactNode;
};

const OPTIONS: Option[] = [
  {
    value: "basket",
    label: "Baschet",
    icon: <BasketballIcon className="h-7 w-7" />,
  },
  { value: "tenis", label: "Tenis", icon: <TennisIcon className="h-7 w-7" /> },
  { value: "fotbal", label: "Fotbal", icon: <SoccerIcon className="h-7 w-7" /> },
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
