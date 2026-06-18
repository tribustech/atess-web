"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ServicesMegaMenu } from "@/components/servicii/ServicesMegaMenu";
import { getCategoriesByAxis } from "@/lib/services";

const NAV = [
  { to: "/servicii", label: "Servicii" },
  { to: "/proiecte", label: "Proiecte" },
  { to: "/configurator", label: "Configurator" },
  { to: "/invata", label: "Învață" },
  { to: "/despre", label: "Despre" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileServiciiOpen, setMobileServiciiOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega-menu on route change
  useEffect(() => {
    setMegaOpen(false);
  }, [pathname]);

  // Close mega-menu on Escape
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pt-safe transition-all duration-300",
        scrolled
          ? "bg-bg-base/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-text-primary"
          aria-label="ATESS"
        >
          <Image
            src="/images/logo-bg.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
            draggable={false}
          />
          <span className="text-sm font-semibold tracking-[0.14em] uppercase text-text-primary">
            ATESS
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => {
            const isActive = pathname === item.to || (item.to === "/servicii" && pathname.startsWith("/servicii"));
            if (item.to === "/servicii") {
              return (
                <div
                  key={item.to}
                  ref={megaRef}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    href={item.to}
                    onFocus={() => setMegaOpen(true)}
                    onBlur={(e) => {
                      // Only close if focus leaves the entire mega container
                      if (!megaRef.current?.contains(e.relatedTarget as Node)) {
                        setMegaOpen(false);
                      }
                    }}
                    className={cn(
                      "text-sm font-medium tracking-wide uppercase transition-colors",
                      isActive
                        ? "text-accent-primary"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    {item.label}
                  </Link>

                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                        onMouseEnter={() => setMegaOpen(true)}
                        onMouseLeave={() => setMegaOpen(false)}
                      >
                        <ServicesMegaMenu onNavigate={() => setMegaOpen(false)} />
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
                className={cn(
                  "text-sm font-medium tracking-wide uppercase transition-colors",
                  isActive
                    ? "text-accent-primary"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="lg:hidden text-text-primary"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-bg-base border-t border-border">
          <nav className="flex flex-col p-6 gap-4">
            {NAV.map((item) => {
              const isActive = pathname === item.to;
              if (item.to === "/servicii") {
                return (
                  <div key={item.to}>
                    <button
                      type="button"
                      onClick={() => setMobileServiciiOpen((v) => !v)}
                      className={cn(
                        "w-full text-left text-lg font-medium uppercase tracking-wide flex items-center justify-between",
                        isActive ? "text-accent-primary" : "text-text-primary"
                      )}
                    >
                      {item.label}
                      <span className="text-base">{mobileServiciiOpen ? "−" : "+"}</span>
                    </button>
                    {mobileServiciiOpen && (
                      <div className="mt-3 ml-4 flex flex-col gap-2">
                        {(["exterior", "interior"] as const).map((axis) =>
                          getCategoriesByAxis(axis).map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/servicii/${cat.slug}`}
                              onClick={() => {
                                setMobileOpen(false);
                                setMobileServiciiOpen(false);
                              }}
                              className="text-sm text-text-muted hover:text-text-primary transition-colors"
                            >
                              {cat.label}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-lg font-medium uppercase tracking-wide",
                    isActive ? "text-accent-primary" : "text-text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
