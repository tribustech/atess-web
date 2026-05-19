import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Despre",
  description: "Pagină în pregătire.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/despre" },
};

export default function DesprePage() {
  return <ComingSoon title="Despre" />;
}
