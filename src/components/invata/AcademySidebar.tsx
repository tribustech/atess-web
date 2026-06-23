"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, List, X, BookOpen } from "lucide-react";

export interface SidebarGroup {
  category: string;
  label: string;
  articles: { slug: string; title: string }[];
}

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(" ");

/* ------------------------------------------------------------------ */
/* Shared nav tree                                                     */
/* ------------------------------------------------------------------ */

function NavTree({
  groups,
  pathname,
  onNavigate,
}: {
  groups: SidebarGroup[];
  pathname: string;
  onNavigate?: () => void;
}) {
  // All groups expanded by default; collapse state keyed by category.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const isIndex = pathname === "/invata";

  return (
    <nav className="flex flex-col gap-8">
      <Link
        href="/invata"
        onClick={onNavigate}
        className={cx(
          "group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors",
          isIndex
            ? "text-accent-primary"
            : "text-text-muted hover:text-text-primary"
        )}
      >
        <BookOpen size={14} />
        Toate articolele
      </Link>

      {groups.map((group) => {
        const open = !collapsed[group.category];
        return (
          <div key={group.category}>
            <button
              type="button"
              onClick={() =>
                setCollapsed((prev) => ({
                  ...prev,
                  [group.category]: !prev[group.category],
                }))
              }
              className="group flex w-full items-center justify-between gap-3 text-left"
              aria-expanded={open}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-text-faint transition-colors group-hover:text-text-muted">
                {group.label}
              </span>
              <ChevronDown
                size={14}
                className={cx(
                  "shrink-0 text-text-faint transition-transform duration-200",
                  open ? "" : "-rotate-90"
                )}
              />
            </button>

            {open && (
              <ul className="mt-3 flex flex-col">
                {group.articles.map((article) => {
                  const href = `/invata/${article.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={article.slug}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cx(
                          "block border-l py-1.5 pl-4 text-sm leading-snug transition-colors",
                          active
                            ? "border-accent-primary text-accent-primary"
                            : "border-border text-text-muted hover:border-text-faint hover:text-text-primary"
                        )}
                      >
                        {article.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop sidebar (grid column)                                       */
/* ------------------------------------------------------------------ */

export function AcademySidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-border lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto py-12 pr-6">
        <NavTree groups={groups} pathname={pathname} />
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile sidebar (FAB + slide-in drawer)                              */
/* ------------------------------------------------------------------ */

export function AcademyMobileNav({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever navigation completes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 border border-accent-primary bg-bg-base/90 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-primary shadow-lg backdrop-blur transition hover:bg-accent-primary hover:text-text-primary"
        aria-label="Deschide lista de articole"
      >
        <List size={15} />
        Articole
      </button>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-bg-base/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-[84%] max-w-xs flex-col border-r border-border bg-bg-base">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-text-faint">
                Învață
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-muted transition-colors hover:text-text-primary"
                aria-label="Închide"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <NavTree
                groups={groups}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
