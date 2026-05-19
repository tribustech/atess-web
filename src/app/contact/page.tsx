import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Contact",
  description: "Pagină în pregătire.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ComingSoon title="Contact" />;
}
