"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  createDefaultLenisController,
  type LenisController,
} from "@/lib/animations/lenis";

const LenisContext = createContext<LenisController | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const controller = useMemo(() => createDefaultLenisController(), []);

  useEffect(() => {
    controller.start();
    return () => controller.stop();
  }, [controller]);

  return (
    <LenisContext.Provider value={controller}>{children}</LenisContext.Provider>
  );
}

export function useLenis() {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error("useLenis must be used within LenisProvider");
  }
  return context;
}
