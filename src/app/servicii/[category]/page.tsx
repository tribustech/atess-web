import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllCategories, getCategory } from "@/lib/services";
import { getServiceSubcategories } from "@/lib/serviceSubcategories";
import { CategoryLayerPhoto } from "@/components/servicii/CategoryLayerPhoto";
import { RelatedProjectsLink } from "@/components/servicii/RelatedProjectsLink";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams(): Promise<{ category: string }[]> {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);

  if (!cat) {
    return {
      title: "Serviciu negăsit",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${cat.label} | Servicii`,
    description: cat.shortBlurb,
    alternates: { canonical: `/servicii/${cat.slug}` },
    openGraph: {
      title: cat.label,
      description: cat.shortBlurb,
      url: `/servicii/${cat.slug}`,
      type: "website",
    },
  };
}

export default async function ServiceCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = getCategory(category);

  if (!cat) {
    notFound();
  }

  const subcategories = getServiceSubcategories(cat.slug);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: cat.label,
    description: cat.shortBlurb,
    url: `${SITE_URL}/servicii/${cat.slug}`,
    provider: {
      "@type": "Organization",
      name: "ATESS Project",
      url: SITE_URL,
    },
    areaServed: "România",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Servicii",
        item: `${SITE_URL}/servicii`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cat.label,
        item: `${SITE_URL}/servicii/${cat.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main>
        {/* ─── Hero ──────────────────────────────────────────────────────────── */}
        <header className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 pb-12 pt-32 md:pb-16 md:pt-40">
            <Link
              href="/servicii"
              className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-accent-primary"
            >
              <ArrowLeft size={14} />
              Toate serviciile
            </Link>

            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
                {cat.group}
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {cat.label}
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-text-muted md:text-xl">
              {cat.intro}
            </p>
          </div>
        </header>

        {/* ─── Layer Photo ───────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <CategoryLayerPhoto photo={cat.layerPhoto} />
        </section>

        {/* ─── SEO Copy Sections ─────────────────────────────────────────────── */}
        {cat.seoCopy.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
              <div className="grid gap-12 md:gap-16">
                {cat.seoCopy.map((section, idx) => (
                  <div key={idx}>
                    <h2 className="mb-4 text-2xl font-semibold tracking-tight md:text-3xl">
                      {section.heading}
                    </h2>
                    <p className="max-w-3xl leading-relaxed text-text-muted">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Subcategories ─────────────────────────────────────────────────── */}
        {subcategories.length > 0 && (
          <section className="border-t border-border bg-bg-elevated/30">
            <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
                Ce executăm
              </p>
              <h2 className="mb-8 text-2xl font-semibold tracking-tight md:text-3xl">
                Tipuri de lucrări
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    id={sub.id}
                    className="scroll-mt-28 rounded-lg border border-border bg-bg-base p-6"
                  >
                    <h3 className="text-lg font-semibold tracking-tight">
                      {sub.label}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {sub.blurb}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Related Projects + Back ────────────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-6 py-10 md:py-12">
            <RelatedProjectsLink
              projectCategory={cat.relatedProjectCategory}
              categoryLabel={cat.label}
            />
          </div>
        </section>
      </main>
    </>
  );
}

