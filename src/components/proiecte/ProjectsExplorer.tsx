"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { RomaniaMap } from "./RomaniaMap";
import { cn } from "@/lib/utils/cn";
import { getProjectsByJudet, JUDET_LABELS, type Project } from "@/lib/projects";
import type { ProjectCategory } from "@/lib/gallery";

type ProjectGroup = {
  category: ProjectCategory;
  label: string;
  projects: Project[];
};

type Filter = ProjectCategory | "toate";

interface ProjectsExplorerProps {
  groups: ProjectGroup[];
  /** Pre-selected category chip, derived from `?categorie=` by the server page. */
  initialCategory?: ProjectCategory;
  /** Raw RomaniaMap.svg markup, read server-side. */
  svgMarkup: string;
}

export function ProjectsExplorer({
  groups,
  initialCategory,
  svgMarkup,
}: ProjectsExplorerProps) {
  const [filter, setFilter] = useState<Filter>(initialCategory ?? "toate");
  const [judet, setJudet] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSelectCategory(slug: Filter) {
    setFilter(slug);
    setJudet(null); // category and county filters are mutually exclusive

    // Keep URL in sync so the back button and direct links work.
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "toate") {
      params.delete("categorie");
    } else {
      params.set("categorie", slug);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const total = useMemo(
    () => groups.reduce((n, g) => n + g.projects.length, 0),
    [groups],
  );

  const visibleGroups = useMemo(
    () => (filter === "toate" ? groups : groups.filter((g) => g.category === filter)),
    [groups, filter],
  );

  const chips: { slug: Filter; label: string; count: number }[] = [
    { slug: "toate", label: "Toate", count: total },
    ...groups.map((g) => ({ slug: g.category, label: g.label, count: g.projects.length })),
  ];

  const judetProjects = judet ? getProjectsByJudet(judet) : [];
  const judetLabel = judet ? (JUDET_LABELS[judet] ?? judet) : null;

  return (
    <div>
      {/* Filter chips — horizontal scroll on mobile, wrap on larger screens */}
      <div
        role="tablist"
        aria-label="Filtrează proiecte după categorie"
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0"
      >
        {chips.map((chip) => {
          const isActive = chip.slug === filter && !judet;
          return (
            <button
              key={chip.slug}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectCategory(chip.slug)}
              className={cn(
                "inline-flex h-10 shrink-0 snap-start items-center whitespace-nowrap border px-4 text-[13px] uppercase tracking-wider transition sm:text-sm",
                isActive
                  ? "border-accent-primary bg-accent-primary text-text-primary"
                  : "border-accent-primary/30 text-text-muted hover:border-accent-primary hover:text-text-primary",
              )}
            >
              {chip.label}
              <span className="ml-2 text-xs opacity-60">({chip.count})</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: sticky map sidebar + results. Mobile: results only. */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(420px,520px)_1fr]">
        {/* Map sidebar — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <RomaniaMap
              svgMarkup={svgMarkup}
              selected={judet}
              onSelectJudet={setJudet}
              showPanel={false}
            />
          </div>
        </aside>

        {/* Results column */}
        <div className="min-w-0">
          {judet ? (
            <section aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-text-primary">
                    {judetLabel}
                  </h2>
                  <p className="mt-1 text-sm text-text-muted">
                    {judetProjects.length === 0
                      ? "Nu avem încă un proiect documentat în acest județ."
                      : `${judetProjects.length} proiect${judetProjects.length === 1 ? "" : "e"} în portofoliu.`}
                  </p>
                </div>
                <button
                  onClick={() => setJudet(null)}
                  className="inline-flex h-9 items-center gap-1.5 border border-accent-primary/30 px-3 text-sm text-text-muted transition hover:border-accent-primary hover:text-text-primary"
                >
                  <X size={14} />
                  Toate județele
                </button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {judetProjects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          ) : (
            <div className="space-y-16">
              {visibleGroups.map((group) => (
                <section key={group.category} aria-label={group.label}>
                  <h2 className="mb-6 text-2xl font-semibold text-text-primary">
                    {group.label}
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {group.projects.map((project) => (
                      <ProjectCard key={project.slug} project={project} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
