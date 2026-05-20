import Link from "next/link";
import { SITE_CONTACT } from "@/lib/site-contact";

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
