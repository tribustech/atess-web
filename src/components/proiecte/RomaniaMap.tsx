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
  /**
   * Controlled selected county code (e.g. "BC"). When provided (defined),
   * the component is controlled and the parent owns selection state.
   */
  selected?: string | null;
  /** Invoked when a county with projects is toggled. Receives the next code or null. */
  onSelectJudet?: (code: string | null) => void;
  /**
   * Whether to render the built-in selected-județ projects panel (aside).
   * Set false when the parent renders its own results column.
   */
  showPanel?: boolean;
}

export function RomaniaMap({
  svgMarkup,
  selected: controlledSelected,
  onSelectJudet,
  showPanel = true,
}: RomaniaMapProps) {
  const counts = useMemo(() => getJudetProjectCounts(), []);
  const isControlled = controlledSelected !== undefined;
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const selected = isControlled ? controlledSelected ?? null : internalSelected;
  const [hovered, setHovered] = useState<string | null>(null);

  const projects = selected ? getProjectsByJudet(selected) : [];
  const selectedLabel = selected ? (JUDET_LABELS[selected] ?? selected) : null;

  function select(code: string) {
    const next = selected === code ? null : code;
    if (!isControlled) setInternalSelected(next);
    onSelectJudet?.(next);
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const path = (e.target as Element).closest("path");
    const code = codeFromPathId(path?.getAttribute("id") ?? null);
    if (!code || !counts[code]) return; // mute counties without projects
    select(code);
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
    e.preventDefault(); // prevent page scroll on Space
    select(code);
  }

  /**
   * Inject per-county colours and a11y attributes into the SVG markup.
   * NOTE: `hovered` is intentionally excluded — hover styling is handled
   * purely via CSS so that hover changes never rebuild the DOM and never
   * destroy keyboard focus.
   */
  const styledSvg = useMemo(() => {
    // Build a CSS block for hover/focus-visible so no DOM rebuild on hover.
    const hoverCss = `
<style>
svg[baseprofile="tiny"] { width: 100% !important; height: auto !important; display: block; }
path[role="button"]:hover { fill: #c4520d !important; }
path[role="button"]:focus-visible { outline: 2px solid #f97316; outline-offset: 2px; }
</style>`;

    // Scope the regex to <path ... id="RO..."> only (not circles).
    let svg = svgMarkup.replace(
      /<path([^>]*)\sid="(RO[A-Z]+)"/g,
      (match, attrs, rawId) => {
        const code = rawId.slice(2);
        if (!(code in JUDET_LABELS)) return match;

        const hasProjects = !!counts[code];
        const isSelected = selected === code;

        const fill = isSelected
          ? "#e8701a"     // accent-primary highlight for selected county
          : hasProjects
          ? "#f97316"     // orange — counties with projects
          : "#2d3748";    // muted dark — counties without projects

        const cursor = hasProjects ? "pointer" : "default";
        const tabIndex = hasProjects ? "0" : "-1";
        const label = JUDET_LABELS[code] ?? code;
        const countText = counts[code]
          ? `, ${counts[code]} proiect${counts[code] === 1 ? "" : "e"}`
          : "";
        const ariaLabel = `${label}${countText}`;

        return `<path${attrs} id="${rawId}" fill="${fill}" style="cursor:${cursor}" tabindex="${tabIndex}" role="button" aria-label="${ariaLabel}" aria-pressed="${isSelected}"`;
      }
    );

    // Inject the <style> block right after the opening <svg ...> tag.
    svg = svg.replace(/(<svg\b[^>]*>)/, `$1${hoverCss}`);

    return svg;
  }, [svgMarkup, counts, selected]);

  const tooltipCode = hovered ?? selected;
  const tooltipLabel = tooltipCode ? (JUDET_LABELS[tooltipCode] ?? tooltipCode) : null;
  const tooltipCount = tooltipCode ? (counts[tooltipCode] ?? 0) : 0;

  const mapBlock = (
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
        <div aria-hidden="true" className="mt-3 flex items-baseline gap-2 text-sm">
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
        Selectați un județ colorat pentru a vedea proiectele din zona respectivă.
        {Object.keys(counts).length > 0
          ? ` Avem proiecte în ${Object.keys(counts).length} județe.`
          : ""}
      </p>
    </div>
  );

  if (!showPanel) return mapBlock;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      {mapBlock}

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
            Niciun județ selectat. Apăsați pe hartă pentru a filtra proiectele.
          </p>
        )}
      </aside>
    </div>
  );
}
