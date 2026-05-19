import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Proiecte",
  description: "Pagină în pregătire.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/proiecte" },
};

export default function ProiectePage() {
  return <ComingSoon title="Proiecte" />;
}
