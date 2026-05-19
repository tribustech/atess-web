"use client";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/shared/Button";

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
  nextLabel = "Continuă",
  nextDisabled,
  hideBack,
  className,
}: Props) {
  return (
    <div className={cn("flex min-h-[calc(100vh-8rem)] flex-col", className)}>
      <div className="mx-auto w-full max-w-2xl px-6 pt-10 pb-32 sm:pt-16">
        <h1 className="text-2xl font-medium text-text-primary sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-base text-text-secondary">{subtitle}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg-base/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-6 py-4">
          {!hideBack ? (
            <Button variant="ghost" size="md" onClick={onBack} disabled={!onBack}>
              Înapoi
            </Button>
          ) : (
            <span />
          )}
          {onNext && (
            <Button variant="primary" size="md" onClick={onNext} disabled={nextDisabled}>
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
