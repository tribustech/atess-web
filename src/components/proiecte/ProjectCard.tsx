import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { JUDET_LABELS, type Project } from "@/lib/projects";
import { PROJECT_CATEGORIES } from "@/lib/gallery";

export function ProjectCard({ project }: { project: Project }) {
  const judet = JUDET_LABELS[project.locationJudet] ?? project.locationJudet;
  const categoryLabel =
    PROJECT_CATEGORIES.find((c) => c.slug === project.category)?.label ??
    project.category;

  return (
    <Link
      href={`/proiecte/${project.slug}`}
      className="group relative flex flex-col overflow-hidden border border-accent-primary/20 bg-black/20 transition hover:border-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-primary">
          {categoryLabel}
        </p>
        <h3 className="text-lg font-semibold text-text-primary">
          {project.title}
        </h3>
        <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-text-muted">
          <div>
            <dt className="sr-only">Locație</dt>
            <dd>
              {project.locationCity}, {judet}
            </dd>
          </div>
          <div>
            <dt className="inline">An: </dt>
            <dd className="inline">{project.year}</dd>
          </div>
          <div>
            <dt className="inline">Suprafață: </dt>
            <dd className="inline">{project.surfaceM2} m²</dd>
          </div>
        </dl>
        <p className="mt-auto inline-flex items-center gap-1 text-sm text-text-muted">
          Vezi proiectul
          <ArrowUpRight
            size={14}
            className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </p>
      </div>
    </Link>
  );
}
