import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ServiceSlug } from "@/lib/services";

type PillarHref = `/servicii/${ServiceSlug}` | "/proiecte";

export const PILLARS: { title: string; body: string; href: PillarHref }[] = [
  {
    title: "Pardoseli sportive",
    body: "Terenuri multisport, săli de sport, baze CNI. Opt sisteme Stockmeier, fiecare cu rolul lui.",
    href: "/servicii/sport-indoor",
  },
  {
    title: "Piste de atletism omologate",
    body: "Cu certificare World Athletics. Doar trei firme din România le pot pune — suntem una dintre ele.",
    href: "/servicii/sport-outdoor",
  },
  {
    title: "Educație & locuri de joacă",
    body: "Grădinițe, școli, parcuri. Inclusiv pardoseli din plută — singurul aplicator certificat din țară.",
    href: "/servicii/locuri-joaca",
  },
  {
    title: "Construcții la cheie",
    body: "De la concept la predare: proiectare, avize, autorizații, turnări, finisaj. Un singur interlocutor pentru tot.",
    href: "/proiecte",
  },
];

export function PillarsGrid() {
  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
              Experiența noastră
            </p>
            <h2 className="mt-4 text-display-lg">Direcțiile noastre.</h2>
            <p className="mt-5 text-lg text-text-muted">
              Patru dintre direcțiile pe care le acoperim astăzi. Lista crește pe
              măsură ce extindem serviciile.
            </p>
          </div>
          <Link
            href="/servicii"
            className="inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition hover:text-text-primary"
          >
            Vezi toate serviciile
            <ArrowUpRight size={14} />
          </Link>
        </header>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PILLARS.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group flex items-start gap-6 border border-border bg-bg-base p-8 transition-all hover:-translate-y-1 hover:border-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-semibold leading-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-text-muted">{p.body}</p>
              </div>
              <ArrowUpRight
                className="shrink-0 text-text-muted transition group-hover:text-accent-primary"
                size={20}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
