export function MissionBlock() {
  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:px-10 md:py-32">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            Misiunea
          </p>
          <h2 className="mt-4 text-display-lg">De ce facem asta.</h2>
        </div>

        <div className="space-y-6 text-lg leading-relaxed text-text-muted md:text-xl">
          <p>
            România este foarte în spate pe infrastructură sportivă. Caietele de
            sarcini sunt copy-paste după proiecte din Dubai sau scrise de
            ChatGPT — detalii de pereți puse pe pardoseală, sisteme gândite
            pentru terenuri omologate aplicate într-un parc public.
          </p>
          <p>
            Ne-am asumat rolul de specialist. Venim cu experiența din spate, nu
            cu broșuri. Dacă proiectul nu are sens așa cum e scris, îl schimbăm.
            Asta e meseria noastră — nu doar să turnăm cauciuc.
          </p>
        </div>
      </div>
    </section>
  );
}
