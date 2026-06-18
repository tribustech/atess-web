import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Ruler, Layers } from "lucide-react";
import {
  getAllProjects,
  getProjectBySlug,
  JUDET_LABELS,
} from "@/lib/projects";
import { PROJECT_CATEGORIES } from "@/lib/gallery";
import { ProjectGallery } from "@/components/proiecte/ProjectGallery";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Proiect negăsit", robots: { index: false, follow: false } };
  }
  const categoryLabel =
    PROJECT_CATEGORIES.find((c) => c.slug === project.category)?.label ??
    project.category;
  const judet = JUDET_LABELS[project.locationJudet] ?? project.locationJudet;
  return {
    title: `${project.title} — ${categoryLabel} | Atess Professional Flooring`,
    description: `${project.description} Locație: ${project.locationCity}, ${judet}.`,
    alternates: { canonical: `/proiecte/${project.slug}` },
    openGraph: {
      title: `${project.title} — Atess Professional Flooring`,
      description: project.description,
      url: `/proiecte/${project.slug}`,
      type: "article",
      images: [{ url: project.heroImage, alt: project.title }],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const judet = JUDET_LABELS[project.locationJudet] ?? project.locationJudet;
  const categoryLabel =
    PROJECT_CATEGORIES.find((c) => c.slug === project.category)?.label ??
    project.category;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url: `${SITE_URL}/proiecte/${project.slug}`,
    dateCreated: String(project.year),
    locationCreated: {
      "@type": "Place",
      name: `${project.locationCity}, ${judet}`,
    },
    image: project.heroImage.startsWith("http")
      ? project.heroImage
      : `${SITE_URL}${project.heroImage}`,
    description: project.description,
    ...(project.client ? { contributor: { "@type": "Organization", name: project.client } } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Proiecte",
        item: `${SITE_URL}/proiecte`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel,
        item: `${SITE_URL}/proiecte?categorie=${project.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${SITE_URL}/proiecte/${project.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        {/* ─── Navigation breadcrumb ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/proiecte"
            className="inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-text-primary"
          >
            <ArrowLeft size={14} /> Înapoi la proiecte
          </Link>
          <Link
            href={`/proiecte?categorie=${project.category}`}
            className="text-sm text-text-muted transition hover:text-text-primary"
          >
            {categoryLabel}
          </Link>
        </div>

        {/* ─── Hero image ──────────────────────────────────────────────────── */}
        <div className="relative mt-8 aspect-[16/7] w-full overflow-hidden">
          <Image
            src={project.heroImage}
            alt={`${project.title} — imagine de ansamblu`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>

        {/* ─── Header ──────────────────────────────────────────────────────── */}
        <header className="mt-8 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-primary">
            {categoryLabel}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-text-muted">{project.description}</p>
        </header>

        {/* ─── Meta row ────────────────────────────────────────────────────── */}
        <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-accent-primary/20 py-8 sm:grid-cols-4">
          <div>
            <dt className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-accent-primary">
              <MapPin size={12} /> Locație
            </dt>
            <dd className="mt-1 text-text-primary">
              {project.locationCity}, {judet}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-accent-primary">
              <Calendar size={12} /> An
            </dt>
            <dd className="mt-1 text-text-primary">{project.year}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-accent-primary">
              <Ruler size={12} /> Suprafață
            </dt>
            <dd className="mt-1 text-text-primary">
              {project.surfaceM2.toLocaleString("ro-RO")} m²
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-accent-primary">
              <Layers size={12} /> Sistem
            </dt>
            <dd className="mt-1 text-text-primary">{project.systemSlug}</dd>
          </div>
          {project.client && (
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-accent-primary">
                Client
              </dt>
              <dd className="mt-1 text-text-primary">{project.client}</dd>
            </div>
          )}
        </dl>

        {/* ─── What we did ─────────────────────────────────────────────────── */}
        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-semibold text-text-primary">Ce am făcut</h2>
          <ul className="mt-4 space-y-2 text-text-muted">
            {project.whatWeDid.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ─── Image gallery ───────────────────────────────────────────────── */}
        {project.images.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold text-text-primary">Galerie</h2>
            <ProjectGallery images={project.images} title={project.title} />
          </section>
        )}

        {/* ─── Footer nav ──────────────────────────────────────────────────── */}
        <div className="mt-16 flex flex-wrap gap-6 border-t border-border pt-8">
          <Link
            href="/proiecte"
            className="inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-text-primary"
          >
            <ArrowLeft size={14} /> Toate proiectele
          </Link>
          <Link
            href={`/proiecte?categorie=${project.category}`}
            className="text-sm text-text-muted transition hover:text-text-primary"
          >
            Mai multe proiecte: {categoryLabel}
          </Link>
        </div>
      </article>
    </>
  );
}
