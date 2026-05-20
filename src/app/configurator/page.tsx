import type { Metadata } from "next";
import { Wizard } from "./Wizard";

export const metadata: Metadata = {
  title: "Configurator proiect",
  description:
    "Configurează-ți proiectul în câțiva pași. Te ghidăm către soluția potrivită și te sunăm cu o estimare inițială.",
  alternates: { canonical: "/configurator" },
};

export default function ConfiguratorPage() {
  return (
    <main className="min-h-screen bg-bg-base pt-[calc(4rem+env(safe-area-inset-top))] sm:pt-[calc(5rem+env(safe-area-inset-top))]">
      <Wizard />
    </main>
  );
}
