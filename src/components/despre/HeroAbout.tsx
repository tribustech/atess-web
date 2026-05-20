import Image from "next/image";

export function HeroAbout() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-bg-base">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-32 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16 md:px-10 md:pb-32 md:pt-40">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-accent-primary" />
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
              Despre
            </p>
          </div>

          <h1 className="text-display-lg">
            Omul din spatele
            <br />
            <span className="text-accent-primary">fiecărui proiect.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg text-text-muted md:text-xl">
            10+ ani pe șantier, opt sisteme pe care le cunoaștem la nivel chimic
            și o singură regulă: dacă nu rezistă peste șase ani, nu îl turnăm.
          </p>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden border border-border bg-neutral-900">
          <Image
            src="/images/39a382ec-6bc6-483a-a77b-f8c532812851.webp"
            alt="Teo Neagu — Fondator ATESS Project"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
            priority
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
              Fondator &amp; Aplicator principal
            </p>
            <p className="mt-1 text-lg font-semibold text-white">Teo Neagu</p>
          </div>
        </div>
      </div>
    </section>
  );
}
