"use client";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  label: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  onSelect: () => void;
};

export function OptionCard({ label, description, icon, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-4 rounded-lg border px-5 py-4 text-left transition-all duration-200",
        "border-border bg-bg-elevated hover:border-accent-primary hover:bg-bg-elevated/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
        selected && "border-accent-primary bg-accent-primary/10",
      )}
    >
      {icon && (
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-accent-primary">
          {icon}
        </span>
      )}
      <span className="flex-1">
        <span className="block font-medium text-text-primary">{label}</span>
        {description && (
          <span className="mt-1 block text-sm text-text-secondary">{description}</span>
        )}
      </span>
    </button>
  );
}
