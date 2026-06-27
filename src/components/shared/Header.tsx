"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ServicesMegaMenu } from "@/components/servicii/ServicesMegaMenu";
import { MobileServiciiMenu } from "@/components/servicii/MobileServiciiMenu";
import { MEGA_MENU_IMAGES } from "@/lib/megaMenuImages";

const NAV = [
  { to: "/servicii", label: "Servicii" },
  { to: "/proiecte", label: "Proiecte" },
  { to: "/configurator", label: "Configurator" },
  { to: "/invata", label: "Învață" },
  { to: "/despre", label: "Despre" },
];

const CTA = { to: "/contact", label: "Contact" };

/** Desktop nav link with an animated crimson underline (grows on hover, stays under the active page). */
function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="group relative py-1 text-[13px] font-medium uppercase tracking-[0.14em]"
    >
      <span
        className={cn(
          "transition-colors duration-200",
          active
            ? "text-text-primary"
            : "text-text-primary/65 group-hover:text-text-primary"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent-primary transition-transform duration-300 ease-out",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileServiciiOpen, setMobileServiciiOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  // Debounce closing so a brief pointer exit between the trigger and the panel
  // (or during the panel's enter/exit animation) does not flicker the menu.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMegaOpen(true);
  };

  const closeMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  // Closes the mobile drawer (and its Servicii accordion) on navigation.
  const closeDrawer = () => {
    setMobileOpen(false);
    setMobileServiciiOpen(false);
  };

  // Clear any pending close timer on unmount.
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega-menu and mobile drawer on route change (back/forward safety net)
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setMobileServiciiOpen(false);
  }, [pathname]);

  // Close mega-menu on Escape
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        // Return focus to the trigger so keyboard users are not dropped to <body>.
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Prefetch the mega-menu photos on idle so the first hover is instant
  // (they're served unoptimized, so the prefetched URL matches what renders).
  useEffect(() => {
    const run = () => {
      for (const { src } of Object.values(MEGA_MENU_IMAGES)) {
        const img = new window.Image();
        img.src = src;
      }
    };
    const ric = (window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
    }).requestIdleCallback;
    if (ric) {
      ric(run);
    } else {
      const t = window.setTimeout(run, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const serviciiActive = pathname.startsWith("/servicii");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] pt-safe transition-colors duration-300",
        scrolled
          ? "bg-bg-base/85 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {/* Scrim — keeps nav legible over busy hero photos when not scrolled */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-bg-base/85 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-0" : "opacity-100"
        )}
      />

      <div
        className={cn(
          "container relative mx-auto px-5 sm:px-6 lg:px-10 flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        )}
      >
        <Link href="/" className="flex items-center" aria-label="ATESS Project">
          <Image
            src="/images/logo-bg-horizontal.png"
            alt="ATESS Project"
            width={1414}
            height={382}
            className={cn(
              "w-auto transition-all duration-300",
              scrolled ? "h-8 sm:h-9" : "h-9 sm:h-10 lg:h-11"
            )}
            priority
            draggable={false}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => {
            if (item.to === "/servicii") {
              return (
                <div
                  key={item.to}
                  ref={megaRef}
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  <Link
                    ref={triggerRef}
                    href={item.to}
                    aria-expanded={megaOpen}
                    aria-controls="servicii-mega-menu"
                    aria-current={serviciiActive ? "page" : undefined}
                    onFocus={openMega}
                    onBlur={(e) => {
                      // relatedTarget can be null during AnimatePresence mounting —
                      // do not close in that case; only close when focus moves to a
                      // node that is outside the entire mega container.
                      if (e.relatedTarget === null) return;
                      if (!megaRef.current?.contains(e.relatedTarget as Node)) {
                        setMegaOpen(false);
                      }
                    }}
                    className="group relative flex items-center gap-1 py-1 text-[13px] font-medium uppercase tracking-[0.14em]"
                  >
                    <span
                      className={cn(
                        "transition-colors duration-200",
                        serviciiActive
                          ? "text-text-primary"
                          : "text-text-primary/65 group-hover:text-text-primary"
                      )}
                    >
                      {item.label}
                    </span>
                    <ChevronDown
                      size={13}
                      strokeWidth={2.5}
                      className={cn(
                        "transition-transform duration-300",
                        serviciiActive
                          ? "text-text-primary"
                          : "text-text-primary/65 group-hover:text-text-primary",
                        megaOpen && "rotate-180"
                      )}
                    />
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent-primary transition-transform duration-300 ease-out",
                        serviciiActive || megaOpen
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </Link>

                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                          "fixed inset-x-0 z-40",
                          scrolled ? "top-14 sm:top-16" : "top-16 sm:top-20",
                        )}
                        onMouseEnter={openMega}
                        onMouseLeave={closeMega}
                        onBlur={(e) => {
                          // Close when Tab moves focus out of the whole mega
                          // container (past the last panel link).
                          if (e.relatedTarget === null) return;
                          if (!megaRef.current?.contains(e.relatedTarget as Node)) {
                            setMegaOpen(false);
                          }
                        }}
                      >
                        <ServicesMegaMenu onNavigate={() => setMegaOpen(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            return (
              <NavLink
                key={item.to}
                href={item.to}
                label={item.label}
                active={pathname === item.to}
              />
            );
          })}

          <Link
            href={CTA.to}
            aria-current={pathname === CTA.to ? "page" : undefined}
            className={cn(
              "group ml-1 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition-all duration-200",
              pathname === CTA.to
                ? "bg-accent-primary text-text-primary"
                : "border border-accent-primary/60 text-text-primary hover:border-accent-primary hover:bg-accent-primary"
            )}
          >
            {CTA.label}
            <ArrowUpRight
              size={15}
              strokeWidth={2.25}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </nav>

        <button
          className="relative z-10 lg:hidden text-text-primary"
          onClick={() => {
            setMobileOpen((v) => {
              if (v) setMobileServiciiOpen(false); // reset accordion on close
              return !v;
            });
          }}
          aria-label={mobileOpen ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "lg:hidden fixed inset-x-0 bottom-0 z-40 origin-top overflow-y-auto overscroll-contain border-t border-border bg-bg-base",
              scrolled ? "top-14 sm:top-16" : "top-16 sm:top-20",
            )}
          >
            <nav className="flex flex-col px-6 pt-4 pb-10">
              {NAV.map((item) => {
                const isActive =
                  pathname === item.to ||
                  (item.to === "/servicii" && serviciiActive);
                if (item.to === "/servicii") {
                  return (
                    <div
                      key={item.to}
                      className="border-b border-border/60 py-3"
                    >
                      <button
                        type="button"
                        onClick={() => setMobileServiciiOpen((v) => !v)}
                        className={cn(
                          "flex w-full items-center justify-between text-left text-lg font-medium uppercase tracking-wide transition-colors",
                          isActive ? "text-accent-primary" : "text-text-primary"
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          size={18}
                          className={cn(
                            "text-text-muted transition-transform duration-300",
                            mobileServiciiOpen && "rotate-180"
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileServiciiOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <MobileServiciiMenu onNavigate={closeDrawer} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "border-b border-border/60 py-3 text-lg font-medium uppercase tracking-wide transition-colors",
                      isActive ? "text-accent-primary" : "text-text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href={CTA.to}
                onClick={() => setMobileOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-text-primary transition-colors hover:bg-accent-deep"
              >
                {CTA.label}
                <ArrowUpRight size={17} strokeWidth={2.25} />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
