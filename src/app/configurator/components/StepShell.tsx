"use client";
import { useLayoutEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { navStore } from "../nav-store";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
  className?: string;
};

export function StepShell({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel,
  nextDisabled,
  hideBack,
  className,
}: Props) {
  useLayoutEffect(() => {
    navStore.set({ onNext, onBack, nextLabel, nextDisabled, hideBack });
  });

  return (
    <div
      className={cn(
        "flex min-h-[calc(100svh-4rem)] flex-col items-stretch sm:min-h-[calc(100svh-5rem)] sm:items-center sm:justify-center",
        "pb-[calc(8rem+env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-2xl px-5 pt-8 pb-6 sm:px-6 sm:py-16">
        <h1 className="text-[1.625rem] font-semibold leading-tight text-text-primary sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {subtitle}
          </p>
        )}
        <div className="mt-6 sm:mt-8">{children}</div>
      </div>
    </div>
  );
}
