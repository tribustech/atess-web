import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { SnapSection } from "@/components/home/SnapSection";
import { ProducersSection } from "@/components/home/ProducersSection";
import { FeaturedArticlesSection } from "@/components/home/FeaturedArticlesSection";
import { getFeaturedArticles } from "@/lib/academy";

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
  const featuredArticles = getFeaturedArticles(3).map((a) => ({
    slug: a.slug,
    title: a.title,
    dek: a.dek,
    readingMin: a.readingMin,
  }));

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
        <SnapSection id="producers" className="bg-bg-base">
          <ProducersSection />
        </SnapSection>
        {/* HOME-FEATURE PLACEHOLDER: Teo va alege elementul vizual de impact care înlocuiește blocul 3D aici (CHANGE-PLAN §3 / F4 01:09) */}
        <SnapSection id="home-feature" className="bg-bg-base">
          <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-center px-6 py-24 md:px-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted">
              Secțiune în pregătire
            </p>
            <p className="mt-4 max-w-xl text-center text-lg text-text-muted">
              Elementul vizual de impact va fi definit în faza următoare.
            </p>
          </div>
        </SnapSection>
        <SnapSection id="clients" className="bg-bg-base">
          <ClientsSection />
        </SnapSection>
        <SnapSection id="invata" className="bg-bg-base">
          <FeaturedArticlesSection articles={featuredArticles} />
        </SnapSection>
        <SnapSection id="cta">
          <FinalCtaSection />
        </SnapSection>
      </div>
    </>
  );
}
