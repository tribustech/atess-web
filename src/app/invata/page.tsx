import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Învață",
  description: "Pagină în pregătire.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/invata" },
};

export default function InvataPage() {
  return <ComingSoon title="Învață" />;
}
