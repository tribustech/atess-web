import Link from "next/link";
import { Button } from "@/components/shared/Button";

export function AboutCta() {
  return (
    <section className="bg-gradient-cta">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="border border-border/70 bg-black/20 p-10 md:p-16">
          <h2 className="max-w-3xl text-display-lg">
            Hai să facem ceva care rezistă.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-text-muted">
            Configurează proiectul în 2 minute sau scrie-ne direct. Revenim cu o
            recomandare validată de Teo.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/configurator">
              <Button size="lg">Configurează proiectul</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
