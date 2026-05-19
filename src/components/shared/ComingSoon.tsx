import Link from "next/link";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({
  title,
  description = "Această pagină este în pregătire.",
}: ComingSoonProps) {
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 pt-20 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-primary">
        În curând
      </p>
      <h1 className="mt-4 text-display-lg">{title}</h1>
      <p className="mt-4 text-text-muted">{description}</p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center border border-accent-primary px-6 text-sm uppercase tracking-wider text-accent-primary transition hover:bg-accent-primary hover:text-text-primary"
      >
        Înapoi la pagina principală
      </Link>
    </div>
  );
}
