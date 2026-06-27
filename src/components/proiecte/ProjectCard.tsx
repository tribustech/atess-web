import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Blocks,
  Building2,
  CalendarDays,
  Footprints,
  Goal,
  KeyRound,
  MapPin,
  Ruler,
  Trees,
  type LucideIcon,
} from "lucide-react";
import { JUDET_LABELS, type Project } from "@/lib/projects";
import { PROJECT_CATEGORIES, type ProjectCategory } from "@/lib/gallery";

/** Icon per canonical project category. */
const CATEGORY_ICONS: Record<ProjectCategory, LucideIcon> = {
  "piste-atletism": Footprints,
  multisport: Goal,
  "locuri-joaca": Blocks,
  "spatii-publice": Trees,
  interioare: Building2,
  "constructii-cheie": KeyRound,
};

/** Format square metres with a thousands separator, e.g. 6400 → "6.400 m²". */
function formatSurface(m2: number): string {
  return `${m2.toLocaleString("ro-RO")} m²`;
}

export function ProjectCard({ project }: { project: Project }) {
  const judet = JUDET_LABELS[project.locationJudet] ?? project.locationJudet;
  const categoryLabel =
    PROJECT_CATEGORIES.find((c) => c.slug === project.category)?.label ??
    project.category;
  const CategoryIcon = CATEGORY_ICONS[project.category] ?? Goal;

  return (
    <Link
      href={`/proiecte/${project.slug}`}
      className="group relative flex flex-col overflow-hidden border border-accent-primary/20 bg-black/20 transition hover:border-accent-primary hover:shadow-[0_0_0_1px_var(--color-accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {/* Gradient scrim so the category badge stays legible on light photos. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/55 to-transparent" />
        {/* Category badge */}
        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 border border-white/15 bg-black/55 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          <CategoryIcon size={12} className="text-accent-primary" />
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold leading-snug text-text-primary">
          {project.title}
        </h3>

        <dl className="grid grid-cols-1 gap-1 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0 text-accent-primary/80" />
            <dt className="sr-only">Locație</dt>
            <dd>
              {project.locationCity}, {judet}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays size={13} className="shrink-0 text-accent-primary/80" />
            <dt className="sr-only">An</dt>
            <dd>{project.year}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler size={13} className="shrink-0 text-accent-primary/80" />
            <dt className="sr-only">Suprafață</dt>
            <dd>{formatSurface(project.surfaceM2)}</dd>
          </div>
        </dl>

        <p className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-medium text-accent-primary">
          Vezi proiectul
          <ArrowUpRight
            size={13}
            className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </p>
      </div>
    </Link>
  );
}
