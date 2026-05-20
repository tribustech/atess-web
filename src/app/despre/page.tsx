import type { Metadata } from "next";
import { HeroAbout } from "@/components/despre/HeroAbout";
import { ManifestoQuote } from "@/components/despre/ManifestoQuote";
import { MissionBlock } from "@/components/despre/MissionBlock";
import { PrinciplesGrid } from "@/components/despre/PrinciplesGrid";
import { PillarsGrid } from "@/components/despre/PillarsGrid";
import { PartnerPanel } from "@/components/despre/PartnerPanel";
import { BeyondProject } from "@/components/despre/BeyondProject";
import { StatsRow } from "@/components/despre/StatsRow";
import { AboutCta } from "@/components/despre/AboutCta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

export const metadata: Metadata = {
  title: "Despre — Teo Neagu & echipa ATESS",
  description:
    "10+ ani pe șantier, aplicator certificat Stockmeier. Pardoseli sportive, piste de atletism și locuri de joacă executate de specialiști.",
  alternates: { canonical: "/despre" },
  openGraph: {
    title: "Despre — ATESS Project",
    description:
      "Omul din spatele fiecărui proiect. Teo Neagu și echipa ATESS.",
    url: "/despre",
    type: "website",
    images: [
      {
        url: "/images/39a382ec-6bc6-483a-a77b-f8c532812851.webp",
        width: 1200,
        height: 1500,
        alt: "Teo Neagu — Fondator ATESS Project",
      },
    ],
  },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Teo Neagu",
  jobTitle: "Fondator & Aplicator principal",
  worksFor: {
    "@type": "Organization",
    name: "ATESS Project",
    url: SITE_URL,
  },
  image: `${SITE_URL}/images/39a382ec-6bc6-483a-a77b-f8c532812851.webp`,
  url: `${SITE_URL}/despre`,
};

export default function DesprePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <main>
        <HeroAbout />
        <ManifestoQuote />
        <MissionBlock />
        <PrinciplesGrid />
        <PillarsGrid />
        <PartnerPanel />
        <BeyondProject />
        <StatsRow />
        <AboutCta />
      </main>
    </>
  );
}
