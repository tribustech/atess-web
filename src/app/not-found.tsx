import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-primary">
        404
      </p>
      <h1 className="mt-4 text-display-lg">Pagina nu a fost găsită</h1>
      <p className="mt-4 text-text-muted">
        Linkul accesat nu există sau a fost mutat.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center border border-accent-primary px-6 text-sm uppercase tracking-wider text-accent-primary transition hover:bg-accent-primary hover:text-text-primary"
      >
        Înapoi la pagina principală
      </Link>
    </main>
  );
}
