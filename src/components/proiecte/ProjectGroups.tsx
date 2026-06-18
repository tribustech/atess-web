"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/lib/projects";
import type { ProjectCategory } from "@/lib/gallery";

type ProjectGroup = {
  category: ProjectCategory;
  label: string;
  projects: Project[];
};

type Filter = ProjectCategory | "toate";

interface ProjectGroupsProps {
  groups: ProjectGroup[];
  /**
   * Pre-selected category chip, derived from `?categorie=` by the server page
   * via `resolveCategorieParam`. Undefined → "Toate" chip is active.
   *
   * Plan C contract: a Servicii page links to
   *   `/proiecte?categorie=locuri-joaca`
   * The page calls `resolveCategorieParam(searchParams.categorie)` and passes
   * the result here so the matching chip is pre-activated on mount.
   */
  initialCategory?: ProjectCategory;
}

export function ProjectGroups({ groups, initialCategory }: ProjectGroupsProps) {
  const [filter, setFilter] = useState<Filter>(initialCategory ?? "toate");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSelect(slug: Filter) {
    setFilter(slug);

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

  const visible = useMemo(
    () => (filter === "toate" ? groups : groups.filter((g) => g.category === filter)),
    [groups, filter],
  );

  const chips: { slug: Filter; label: string; count: number }[] = [
    { slug: "toate", label: "Toate", count: total },
    ...groups.map((g) => ({ slug: g.category, label: g.label, count: g.projects.length })),
  ];

  return (
    <>
      {/* Filter chips */}
      <div
        role="tablist"
        aria-label="Filtrează proiecte după categorie"
        className="flex flex-wrap gap-2"
      >
        {chips.map((chip) => {
          const isActive = chip.slug === filter;
          return (
            <button
              key={chip.slug}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(chip.slug)}
              className={cn(
                "inline-flex h-10 items-center border px-4 text-sm uppercase tracking-wider transition",
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

      {/* Grouped project rows */}
      <div className="mt-12 space-y-16">
        {visible.map((group) => (
          <section key={group.category} aria-label={group.label}>
            <h2 className="mb-6 text-2xl font-semibold text-text-primary">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
