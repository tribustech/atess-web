import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Configurator",
  description: "Pagină în pregătire.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/configurator" },
};

export default function ConfiguratorPage() {
  return <ComingSoon title="Configurator" />;
}
