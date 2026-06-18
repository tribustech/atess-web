export function MissionBlock() {
  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:px-10 md:py-32">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            Povestea fondatorului
          </p>
          <h2 className="mt-4 text-display-lg">De unde am pornit.</h2>
        </div>

        <div className="space-y-6 text-lg leading-relaxed text-text-muted md:text-xl">
          <p>
            Am pornit de pe șantier, nu din spatele unui catalog. Primele
            proiecte le-am învățat turnând, greșind și corectând — la rece, în
            condiții reale, cu beneficiari care aveau nevoie de o suprafață care
            rezistă, nu de o promisiune. Din acel teren a crescut ATESS Project.
          </p>
          <p>
            Astăzi am structurat experiența într-o echipă și într-un set de
            sisteme pe care le cunoaștem la nivel chimic. Aceeași disciplină de
            la prima turnare ne ghidează fiecare proiect: dacă o soluție nu
            rezistă în timp, nu o propunem.
          </p>
        </div>
      </div>
    </section>
  );
}
