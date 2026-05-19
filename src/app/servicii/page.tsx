import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Servicii",
  description: "Pagină în pregătire.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/servicii" },
};

export default function ServiciiPage() {
  return <ComingSoon title="Servicii" />;
}
