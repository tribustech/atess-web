import Link from "next/link";
import { ArrowRight, Goal, Home, Trophy } from "lucide-react";
import { Button } from "@/components/shared/Button";

export function FinalCtaSection() {
  return (
    <div className="flex min-h-[100svh] items-center bg-gradient-cta">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10">
        <div className="grid gap-8 border border-border/70 bg-black/20 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <h2 className="text-display-lg">
              Construieste urmatorul proiect ATESS
            </h2>
            <p className="mt-5 max-w-xl text-lg text-text-muted">
              In 2 minute afli sistemele potrivite, pasii de executie si
              recomandarile pe care Teo le valideaza cu tine.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/configurator">
                <Button size="lg">Incepe configuratorul</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="ghost">
                  Vorbeste cu Teo
                </Button>
              </Link>
            </div>
          </div>

          <Link
            href="/configurator"
            aria-label="Deschide configuratorul"
            className="group block rounded-lg border border-border bg-bg-base/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_60px_-30px_rgba(0,0,0,0.6)] transition duration-300 hover:-translate-y-0.5 hover:border-accent-primary/60 hover:bg-bg-base/85 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_80px_-30px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                Pasul 1 din 7
              </p>
              <div className="flex gap-1">
                <span className="h-1 w-6 rounded-full bg-accent-primary" />
                <span className="h-1 w-6 rounded-full bg-border" />
                <span className="h-1 w-6 rounded-full bg-border" />
                <span className="h-1 w-6 rounded-full bg-border" />
              </div>
            </div>

            <p className="mt-5 text-base font-medium text-text-primary">
              Ce vrei să configurăm?
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-md border border-accent-primary bg-accent-primary/10 px-3 py-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-accent-primary/20 text-accent-primary">
                  <Goal className="h-4 w-4" />
                </span>
                <span className="text-sm text-text-primary">Pistă de atletism</span>
                <span className="ml-auto h-2 w-2 rounded-full bg-accent-primary" />
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border bg-bg-elevated px-3 py-2.5 transition group-hover:border-border/80">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-bg-subtle text-text-muted">
                  <Trophy className="h-4 w-4" />
                </span>
                <span className="text-sm text-text-muted">Teren multisport</span>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border bg-bg-elevated px-3 py-2.5 transition group-hover:border-border/80">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-bg-subtle text-text-muted">
                  <Home className="h-4 w-4" />
                </span>
                <span className="text-sm text-text-muted">Pardoseală interioară</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] text-text-muted/80">
                + încă 4 categorii
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-primary transition group-hover:gap-2.5">
                Deschide
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
