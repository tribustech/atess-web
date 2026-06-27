"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useLenis } from "@/components/motion/LenisProvider";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Lenis owns the scroll position, so reset it through Lenis (a plain
    // window.scrollTo gets overridden by Lenis's rAF loop on the next frame).
    lenis.scrollTo(0, { immediate: true });
    // Fallback for when Lenis isn't active yet (e.g. reduced motion).
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, lenis]);

  return <main className="flex-1">{children}</main>;
}
