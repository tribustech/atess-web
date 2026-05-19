import Image from "next/image";

export function TeoSection() {
  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 py-24 md:px-10">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden border border-border bg-neutral-900">
          <Image
            src="/images/39a382ec-6bc6-483a-a77b-f8c532812851.webp"
            alt="Teo Neagu"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
              Consultant principal
            </p>
            <p className="mt-1 text-lg font-semibold text-white">Teo Neagu</p>
          </div>
        </div>
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-text-muted">
            E4
          </p>
          <h2 className="mt-3 text-display-lg">Teo Neagu</h2>
          <p className="mt-5 text-lg text-text-muted">
            Fiecare proiect începe cu întrebarea potrivită: unde va fi folosit
            spațiul, cum va fi întreținut și cum va arăta peste 10 ani.
          </p>
          <blockquote className="mt-8 border-l-2 border-accent-primary pl-5 text-xl text-text-primary font-serif italic">
            „Nu vindem doar sisteme. Construim suprafețe pe care comunitățile
            chiar le folosesc, zi de zi.”
          </blockquote>
        </div>
      </div>
    </div>
  );
}
