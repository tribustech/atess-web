"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            const isActive = pathname === item.to;
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
