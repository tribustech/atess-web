import Link from "next/link";
import { Button } from "@/components/shared/Button";

export function AboutCta() {
  return (
    <section className="bg-gradient-cta">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32">
        <div className="border border-border/70 bg-black/20 p-7 sm:p-10 md:p-16">
          <h2 className="max-w-3xl text-display-lg">
            Hai să facem ceva care rezistă.
          </h2>
          <p className="mt-5 max-w-xl text-base text-text-muted sm:mt-6 sm:text-lg">
            Configurează proiectul în 2 minute sau scrie-ne direct. Revenim cu o
            recomandare validată de Teo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href="/configurator" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-12 w-full px-6 text-base sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
              >
                Configurează proiectul
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full px-6 text-base sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
              >
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
