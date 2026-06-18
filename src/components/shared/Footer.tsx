import type React from "react";
import Link from "next/link";
import { SITE_CONTACT } from "@/lib/site-contact";

// TODO: real social URLs — accounts not yet created
const SOCIAL_LINKS: { href: string; label: string; svg: React.ReactNode }[] = [
  {
    href: "#",
    label: "ATESS pe Instagram",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "ATESS pe LinkedIn",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "ATESS pe TikTok",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-bg-elevated border-t border-border mt-20">
      <div className="container mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-display text-xl font-bold">ATESS</span>
            <span className="text-accent-primary font-display text-xl font-bold">
              PROJECT
            </span>
          </div>
          <p className="text-text-muted text-sm max-w-xs">
            Pardoseli sportive profesionale. Aplicator certificat Stockmeier.
            10+ ani pe teren.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {SOCIAL_LINKS.map(({ href, label, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-text-muted hover:text-accent-primary transition-colors"
              >
                {svg}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-wider text-text-muted mb-4">
            Navigare
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/servicii"
                className="text-text-primary hover:text-accent-primary text-sm"
              >
                Servicii
              </Link>
            </li>
            <li>
              <Link
                href="/proiecte"
                className="text-text-primary hover:text-accent-primary text-sm"
              >
                Proiecte
              </Link>
            </li>
            <li>
              <Link
                href="/configurator"
                className="text-text-primary hover:text-accent-primary text-sm"
              >
                Configurator
              </Link>
            </li>
            <li>
              <Link
                href="/invata"
                className="text-text-primary hover:text-accent-primary text-sm"
              >
                Învață
              </Link>
            </li>
            <li>
              <Link
                href="/despre"
                className="text-text-primary hover:text-accent-primary text-sm"
              >
                Despre
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-wider text-text-muted mb-4">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-text-primary">
            <li>{SITE_CONTACT.city}, {SITE_CONTACT.region}</li>
            <li>
              <a
                href={`mailto:${SITE_CONTACT.email}`}
                className="hover:text-accent-primary"
              >
                {SITE_CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE_CONTACT.phone.tel}`}
                className="hover:text-accent-primary"
              >
                {SITE_CONTACT.phone.display}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-6 text-text-faint text-xs flex justify-between">
          <span>
            © {new Date().getFullYear()} ATESS Project. Toate drepturile rezervate.
          </span>
          <span>Built with precision.</span>
        </div>
      </div>
    </footer>
  );
}
