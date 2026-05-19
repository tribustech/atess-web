"use client";
import { type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type Props = {
  label: string;
  description?: string;
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  selected?: boolean;
  onSelect: () => void;
};

export function OptionCard({
  label,
  description,
  icon,
  imageSrc,
  imageAlt,
  selected,
  onSelect,
}: Props) {
  const hasMedia = Boolean(imageSrc) || Boolean(icon);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex w-full overflow-hidden rounded-lg border text-left transition-all duration-200",
        "border-border bg-bg-elevated hover:border-accent-primary hover:bg-bg-elevated/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
        selected && "border-accent-primary bg-accent-primary/10",
      )}
    >
      {hasMedia && (
        <span
          className={cn(
            "relative flex h-24 w-28 shrink-0 items-center justify-center overflow-hidden bg-bg-base sm:h-28 sm:w-36",
            !imageSrc && "text-accent-primary",
          )}
          aria-hidden={!imageSrc}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              fill
              sizes="(min-width: 640px) 144px, 112px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center">
              {icon}
            </span>
          )}
        </span>
      )}
      <span className="flex flex-1 flex-col justify-center px-5 py-4">
        <span className="block font-medium text-text-primary">{label}</span>
        {description && (
          <span className="mt-1 block text-sm text-text-secondary">{description}</span>
        )}
      </span>
    </button>
  );
}
