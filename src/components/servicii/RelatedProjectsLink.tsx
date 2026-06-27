/**
 * RelatedProjectsLink — cross-links from a service category to the
 * filtered projects gallery and back to the home page.
 *
 * Server component (no "use client").
 *
 * Cross-plan dependency (Plan G — proiecte):
 *   The link `/proiecte?categorie=<slug>` requires Plan G's gallery page
 *   to read the `categorie` query param and pre-activate the matching
 *   FilterChip. If the param is not yet implemented the link still lands
 *   on `/proiecte` without an active filter — graceful degradation.
 *
 *   Canonical slugs for `projectCategory` (RelatedProjectCategory from
 *   @/lib/services):
 *     "piste-atletism" | "multisport" | "locuri-joaca" |
 *     "spatii-publice" | "interioare" | "constructii-cheie"
 */

import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RelatedProjectsLinkProps {
  /** One of the 6 canonical RelatedProjectCategory slugs from @/lib/services */
  projectCategory: string;
  /** Human-readable label for the category, used in the link text */
  categoryLabel: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RelatedProjectsLink({
  projectCategory,
  categoryLabel,
}: RelatedProjectsLinkProps): React.JSX.Element {
  return (
    <nav
      aria-label="Navigare conexă"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Primary CTA — filtered projects gallery */}
      {/* Cross-plan contract: Plan G must read ?categorie= into its FilterChips */}
      <Link
        href={`/proiecte?categorie=${projectCategory}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-green transition-colors hover:text-brand-green/80"
      >
        Proiecte din categoria {categoryLabel}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
      </Link>

      {/* Secondary — back to home */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-default"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
        Înapoi la pagina principală
      </Link>
    </nav>
  );
}
