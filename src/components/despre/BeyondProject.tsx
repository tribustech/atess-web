import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function BeyondProject() {
  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:px-10 md:py-32">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            Dincolo de proiect
          </p>
          <h2 className="mt-4 text-display-lg">
            Învățăm
            <br />
            <span className="text-accent-primary">industria.</span>
          </h2>
        </div>

        <div className="space-y-6 text-lg leading-relaxed text-text-muted md:text-xl">
          <p>
            Lucrăm și cu cei care scriu caietele de sarcini. Workshops cu
            Ordinul Arhitecților, tutoriale gratuite pe pagina de Învață, și un
            showroom deschis tuturor — arhitecți, ingineri, beneficiari finali.
          </p>
          <p className="text-text-primary">
            Nu îți vindem un sistem. Te învățăm să-l ceri corect.
          </p>

          <div className="pt-2">
            <Link
              href="/invata"
              className="group inline-flex items-center gap-3 border border-accent-primary px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-primary transition hover:bg-accent-primary hover:text-text-primary"
            >
              Tutoriale gratuite
              <ArrowUpRight
                size={14}
                className="transition group-hover:rotate-12"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
