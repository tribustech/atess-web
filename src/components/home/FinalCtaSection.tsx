import { Button } from "@/components/shared/Button";

export function FinalCtaSection() {
  return (
    <div className="flex min-h-[100svh] items-center bg-gradient-cta">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10">
        <div className="grid gap-8 border border-border/70 bg-black/20 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-text-muted">
              E5
            </p>
            <h2 className="mt-3 text-display-lg">
              Construieste urmatorul proiect ATESS
            </h2>
            <p className="mt-5 max-w-xl text-lg text-text-muted">
              In 2 minute afli sistemele potrivite, pasii de executie si
              recomandarile pe care Teo le valideaza cu tine.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg">Incepe configuratorul</Button>
              <Button size="lg" variant="ghost">
                Vorbeste cu Teo
              </Button>
            </div>
          </div>
          <div className="border border-border bg-bg-base/60 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
              Preview configurator
            </p>
            <div className="mt-4 space-y-3">
              <div className="h-10 border border-border bg-bg-subtle" />
              <div className="h-10 border border-border bg-bg-subtle" />
              <div className="h-10 border border-border bg-bg-subtle" />
              <div className="h-10 w-2/3 border border-accent-primary bg-accent-primary/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
