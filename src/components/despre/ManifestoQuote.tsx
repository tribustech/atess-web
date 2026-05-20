export function ManifestoQuote() {
  return (
    <section className="bg-bg-base">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center md:px-10 md:py-32">
        <span
          aria-hidden="true"
          className="block font-serif text-7xl leading-none text-accent-primary md:text-8xl"
        >
          &ldquo;
        </span>
        <blockquote className="mt-2 font-serif text-2xl italic leading-snug text-text-primary md:text-3xl lg:text-4xl">
          Nu am citit fișe tehnice. Am învățat pe propria piele ce rezistă și ce
          nu. Tot ce am turnat acum șase ani încă rezistă — și nu e o
          coincidență.
        </blockquote>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
          — Teo Neagu
        </p>
      </div>
    </section>
  );
}
