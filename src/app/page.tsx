import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { TeoSection } from "@/components/home/TeoSection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { SnapSection } from "@/components/home/SnapSection";
import { FlooringSystemClient } from "@/components/home/FlooringSystemClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

export const metadata: Metadata = {
  title: "ATESS Project — Pardoseli sportive profesionale",
  description:
    "Pardoseli sportive profesionale. Aplicator certificat Stockmeier. 10+ ani pe teren.",
  alternates: { canonical: "/" },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ATESS Project",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-bg.png`,
  sameAs: [],
};

const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ATESS Project",
  url: SITE_URL,
  image: `${SITE_URL}/images/logo-bg.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "București",
    addressCountry: "RO",
  },
  email: "contact@atess.ro",
  telephone: "+40700000000",
  areaServed: "RO",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />
      <div>
        <SnapSection id="hero">
          <HeroSection />
        </SnapSection>
        <FlooringSystemClient />
        <SnapSection id="clients" className="bg-bg-base">
          <ClientsSection />
        </SnapSection>
        <SnapSection id="teo" className="bg-bg-base">
          <TeoSection />
        </SnapSection>
        <SnapSection id="cta">
          <FinalCtaSection />
        </SnapSection>
      </div>
    </>
  );
}
