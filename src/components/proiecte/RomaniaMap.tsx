"use client";

import { useMemo, useState } from "react";
import {
  getJudetProjectCounts,
  getProjectsByJudet,
  JUDET_LABELS,
} from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

/** Strip "RO" prefix from a county path id, e.g. "ROBC" → "BC", "ROB" → "B". */
function codeFromPathId(id: string | null): string | null {
  if (!id || !id.startsWith("RO")) return null;
  const code = id.slice(2);
  // Only valid if it maps to a known județ label (guards against stray RO-prefixed ids).
  return code in JUDET_LABELS ? code : null;
}

interface RomaniaMapProps {
  /** Raw SVG markup string, read server-side with fs.readFileSync. */
  svgMarkup: string;
  /** Optional callback invoked when a county with projects is clicked/selected. */
  onSelectJudet?: (code: string) => void;
}

export function RomaniaMap({ svgMarkup, onSelectJudet }: RomaniaMapProps) {
  const counts = useMemo(() => getJudetProjectCounts(), []);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const projects = selected ? getProjectsByJudet(selected) : [];
  const selectedLabel = selected ? (JUDET_LABELS[selected] ?? selected) : null;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const path = (e.target as Element).closest("path");
    const code = codeFromPathId(path?.getAttribute("id") ?? null);
    if (!code || !counts[code]) return; // mute counties without projects
    setSelected((cur) => (cur === code ? null : code));
    onSelectJudet?.(code);
  }

  function handleMouseOver(e: React.MouseEvent<HTMLDivElement>) {
    const path = (e.target as Element).closest("path");
    const code = codeFromPathId(path?.getAttribute("id") ?? null);
    setHovered(code ?? null);
  }

  function handleMouseOut() {
    setHovered(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Enter" && e.key !== " ") return;
    const target = e.target as Element;
    const code = codeFromPathId(target.getAttribute("id") ?? null);
    if (!code || !counts[code]) return;
    setSelected((cur) => (cur === code ? null : code));
    onSelectJudet?.(code);
  }

  /**
   * Inject per-county colours into the SVG markup before rendering.
   * Counties with projects get the accent colour; the selected county gets a
   * distinct highlight; all others stay muted.
   */
  const styledSvg = useMemo(() => {
    let svg = svgMarkup;

    // Replace each county path's fill based on project presence.
    svg = svg.replace(/id="(RO[A-Z]+)"/g, (match, rawId) => {
      const code = rawId.slice(2);
      if (!(code in JUDET_LABELS)) return match;

      const hasProjects = !!counts[code];
      const isSelected = selected === code;
      const isHovered = hovered === code;

      let fill: string;
      if (isSelected) {
        fill = "#e8701a"; // accent-primary highlight for selected county
      } else if (isHovered && hasProjects) {
        fill = "#c4520d"; // darker on hover
      } else if (hasProjects) {
        fill = "#f97316"; // orange — counties with projects
      } else {
        fill = "#2d3748"; // muted dark — counties without projects
      }

      const cursor = hasProjects ? "pointer" : "default";
      const tabIndex = hasProjects ? "0" : "-1";
      const label = JUDET_LABELS[code] ?? code;
      const countText = counts[code] ? `, ${counts[code]} proiect${counts[code] === 1 ? "" : "e"}` : "";
      const ariaLabel = `${label}${countText}`;

      return `${match} fill="${fill}" style="cursor:${cursor}" tabindex="${tabIndex}" role="button" aria-label="${ariaLabel}" aria-pressed="${isSelected}"`;
    });

    return svg;
  }, [svgMarkup, counts, selected, hovered]);

  const tooltipCode = hovered ?? selected;
  const tooltipLabel = tooltipCode ? (JUDET_LABELS[tooltipCode] ?? tooltipCode) : null;
  const tooltipCount = tooltipCode ? (counts[tooltipCode] ?? 0) : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      {/* Map panel */}
      <div>
        <div
          role="group"
          aria-label="Hartă proiecte pe județe"
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onKeyDown={handleKeyDown}
          className="relative w-full overflow-hidden"
          dangerouslySetInnerHTML={{ __html: styledSvg }}
        />

        {/* Tooltip */}
        {tooltipLabel && (
          <div
            aria-hidden="true"
            className="mt-3 flex items-baseline gap-2 text-sm"
          >
            <span className="font-semibold text-text-primary">{tooltipLabel}</span>
            {tooltipCount > 0 ? (
              <span className="text-accent-primary">
                {tooltipCount} proiect{tooltipCount === 1 ? "" : "e"}
              </span>
            ) : (
              <span className="text-text-muted">niciun proiect documentat</span>
            )}
          </div>
        )}

        <p className="mt-3 text-sm text-text-muted">
          Selectați un județ colorat pentru a vedea proiectele din zona
          respectivă.
          {Object.keys(counts).length > 0
            ? ` Avem proiecte în ${Object.keys(counts).length} județe.`
            : ""}
        </p>
      </div>

      {/* Projects panel */}
      <aside aria-live="polite">
        {selectedLabel ? (
          <>
            <h2 className="text-2xl font-semibold text-text-primary">
              {selectedLabel}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {projects.length === 0
                ? "Nu avem încă un proiect documentat în acest județ."
                : `${projects.length} proiect${projects.length === 1 ? "" : "e"} în portofoliu.`}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-text-muted">
            Niciun județ selectat. Apăsați pe hartă pentru a filtra
            proiectele.
          </p>
        )}
      </aside>
    </div>
  );
}
