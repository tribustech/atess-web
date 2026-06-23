"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { getCategoriesByAxis, AXIS_LABEL, type ServiceAxis } from "@/lib/services";
import { getMegaMenuImage } from "@/lib/megaMenuImages";
import { getServiceSubcategories } from "@/lib/serviceSubcategories";

interface MobileServiciiMenuProps {
  /** Closes the whole drawer; fired on every navigational link tap. */
  onNavigate: () => void;
}

const AXES: ServiceAxis[] = ["exterior", "interior"];

/**
 * Mobile "Servicii" menu — an accordion (the recommended mobile multi-level
 * pattern). Categories are grouped under Exterior / Interior headings; each
 * row keeps a small photo thumbnail + label and expands on tap to reveal a
 * "Toate <category>" link plus its subcategories. Only Link taps close the
 * drawer; the row button just toggles its section.
 */
export function MobileServiciiMenu({ onNavigate }: MobileServiciiMenuProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="mt-3 flex flex-col gap-6 pt-1">
      {AXES.map((axis) => (
        <div key={axis}>
          {/* Group heading + rule */}
          <div className="mb-1 flex items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary">
              {AXIS_LABEL[axis]}
            </h3>
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>

          <ul className="divide-y divide-border/60">
            {getCategoriesByAxis(axis).map((cat) => {
              const photo = getMegaMenuImage(cat.slug);
              const subs = getServiceSubcategories(cat.slug);
              const isOpen = openSlug === cat.slug;
              return (
                <li key={cat.slug}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`m-subs-${cat.slug}`}
                    onClick={() => setOpenSlug(isOpen ? null : cat.slug)}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-neutral-900">
                      <Image
                        src={photo.src}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>
                    <span className="flex-1 text-[15px] font-medium text-text-primary">
                      {cat.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        "shrink-0 text-text-muted transition-transform duration-300",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`subs-${cat.slug}`}
                        id={`m-subs-${cat.slug}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <ul className="flex flex-col gap-1 pb-3 pl-14">
                          <li>
                            <Link
                              href={`/servicii/${cat.slug}`}
                              onClick={onNavigate}
                              className="block py-1.5 text-sm font-medium text-accent-primary"
                            >
                              Toate · {cat.label}
                            </Link>
                          </li>
                          {subs.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/servicii/${cat.slug}#${sub.id}`}
                                onClick={onNavigate}
                                className="block py-1.5 text-sm text-text-muted transition-colors active:text-text-primary"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="mt-1 flex items-center gap-5 border-t border-border pt-4">
        <Link
          href="/servicii"
          onClick={onNavigate}
          className="text-xs uppercase tracking-wider text-text-muted transition-colors active:text-text-primary"
        >
          Toate serviciile
        </Link>
        <Link
          href="/proiecte"
          onClick={onNavigate}
          className="text-xs uppercase tracking-wider text-text-muted transition-colors active:text-text-primary"
        >
          Vezi proiecte
        </Link>
      </div>
    </div>
  );
}
