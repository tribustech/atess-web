const PRINCIPLES = [
  {
    index: "01",
    title: "Învățat pe șantier",
    body: "Nu vorbim din fișa tehnică a producătorului. Am pus mâna pe ele toate, am greșit și ne-am corectat. Știm de ce un sistem care merge într-o școală privată moare în trei luni într-un parc public.",
  },
  {
    index: "02",
    title: "200g în plus, mereu",
    body: "Fișa tehnică spune 1,3 kg de poliuretan la metru. Noi punem 1,5. Costă mai mult acum, dar dispar mantenanțele și garanțiile la doi ani. Tot ce am făcut din 2019 încă rezistă — pentru că am pus liant, nu praf colorat.",
  },
  {
    index: "03",
    title: "Schimbăm soluția",
    body: "Un teren de basket din sectorul 2 nu rămâne teren de basket — intră biciclete, role, cărucioare, câini. Asta nu schimbi prin mentenanță. O schimbi din sistem, de la început. Dacă noi nu îți spunem asta, n-o să-ți spună nimeni.",
  },
];

export function PrinciplesGrid() {
  return (
    <section className="bg-bg-base">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            Felul în care lucrăm
          </p>
          <h2 className="mt-4 text-display-lg">Trei principii.</h2>
          <p className="mt-5 text-lg text-text-muted">
            Nu sunt slogane. Sunt lecții pe care le-am plătit pe ele cândva și
            care acum țin proiectele în picioare.
          </p>
        </header>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <article
              key={p.index}
              className="group flex flex-col border border-border bg-bg-elevated p-8 transition-colors hover:border-accent-primary"
            >
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
                {p.index}
              </p>
              <h3 className="mt-6 text-2xl font-semibold leading-tight">
                {p.title}
              </h3>
              <p className="mt-4 text-text-muted">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
