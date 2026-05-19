import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SnapSectionProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

export function SnapSection({ id, className, children }: SnapSectionProps) {
  return (
    <section
      id={id}
      className={cn("relative min-h-[100svh] scroll-mt-24", className)}
    >
      {children}
    </section>
  );
}
