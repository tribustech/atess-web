import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Holding page shown on /proiecte while PORTFOLIO_PUBLIC is false.
 * Background motif: the lanes of an athletic track, with a runner (a short red
 * dash) lapping the inside lane.
 */

const LANES = 8;
const CX = 600;
const CY = 400;
const STRAIGHT = 520;
const R0 = 150;
const LANE_W = 22;

// Stadium outline: two straights joined by half circles.
const stadium = (r: number) =>
  `M ${CX - STRAIGHT / 2} ${CY - r} h ${STRAIGHT} a ${r} ${r} 0 0 1 0 ${2 * r} h ${-STRAIGHT} a ${r} ${r} 0 0 1 0 ${-2 * r} Z`;

const UPCOMING = [
  {
    n: "01",
    title: "Proiecte documentate",
    body: "Lucrări prezentate pe categorii, cu sistemul aplicat, suprafața și etapele de execuție.",
  },
  {
    n: "02",
    title: "Hartă națională",
    body: "Proiectele Atess din toată România, grupate pe județe.",
  },
  {
    n: "03",
    title: "Studii de caz",
    body: "De la stratul suport până la omologare — cum am rezolvat proiectele dificile.",
  },
];

export function PortfolioComingSoon() {
  return (
    <div className="relative overflow-hidden">
      <style>{`
        @keyframes pcs-lap { to { stroke-dashoffset: -1000; } }
        @keyframes pcs-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .pcs-runner { stroke-dasharray: 26 974; animation: pcs-lap 14s linear infinite; }
        .pcs-runner-2 { stroke-dasharray: 8 992; animation: pcs-lap 19s linear infinite; animation-delay: -6s; }
        .pcs-rise { opacity: 0; animation: pcs-rise 0.9s cubic-bezier(.22,.8,.2,1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .pcs-runner, .pcs-runner-2 { animation: none; }
          .pcs-rise { animation: none; opacity: 1; }
        }
      `}</style>

      {/* Track lanes */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 800"
        className="pointer-events-none absolute left-1/2 top-24 w-[150%] max-w-none -translate-x-[22%] opacity-90 md:-top-16 md:w-[115%] md:-translate-x-[30%] lg:w-[95%] lg:-translate-x-[18%]"
        style={{
          maskImage: "radial-gradient(ellipse 58% 52% at 55% 45%, #000 35%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 58% 52% at 55% 45%, #000 35%, transparent 78%)",
        }}
      >
        <g fill="none" stroke="currentColor" className="text-text-faint">
          {Array.from({ length: LANES + 1 }, (_, i) => (
            <path key={i} d={stadium(R0 + i * LANE_W)} strokeWidth={i === 0 ? 1.4 : 0.8} opacity={i === 0 ? 0.9 : 0.55} />
          ))}
        </g>
        {/* Finish line across all lanes */}
        <line
          x1={CX + STRAIGHT / 2 - 40}
          y1={CY + R0}
          x2={CX + STRAIGHT / 2 - 40}
          y2={CY + R0 + LANES * LANE_W}
          className="text-text-muted"
          stroke="currentColor"
          strokeWidth={2}
          opacity={0.5}
        />
        <path d={stadium(R0 + LANE_W / 2)} pathLength={1000} fill="none" className="pcs-runner text-accent-primary" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
        <path d={stadium(R0 + LANE_W * 3.5)} pathLength={1000} fill="none" className="pcs-runner-2 text-text-muted" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      </svg>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[88rem] flex-col justify-center px-6 pb-20 pt-32">
        <p className="pcs-rise flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] text-accent-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-primary opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-primary" />
          </span>
          Portofoliu · în lucru
        </p>

        <h1 className="pcs-rise mt-6 max-w-4xl text-display-xl" style={{ animationDelay: "80ms" }}>
          Pregătim
          <br />
          ceva <span className="text-accent-primary">nou.</span>
        </h1>

        <p className="pcs-rise mt-8 max-w-xl text-lg leading-relaxed text-text-muted" style={{ animationDelay: "160ms" }}>
          Reorganizăm portofoliul de proiecte într-o prezentare nouă, mai completă.
          Revenim în curând cu lucrările realizate de echipa Atess în toată țara.
        </p>

        <div className="pcs-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center gap-2 bg-accent-primary px-6 text-sm uppercase tracking-wider text-text-primary transition hover:bg-accent-deep"
          >
            Discutați un proiect
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/servicii"
            className="inline-flex h-12 items-center border border-border px-6 text-sm uppercase tracking-wider text-text-muted transition hover:border-text-muted hover:text-text-primary"
          >
            Vezi serviciile
          </Link>
        </div>

        <div className="pcs-rise mt-20 border-t border-border pt-10 md:mt-28" style={{ animationDelay: "320ms" }}>
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.35em] text-text-faint">Ce urmează</p>
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {UPCOMING.map((item) => (
              <li key={item.n} className="group">
                <span className="font-mono text-xs text-accent-primary">{item.n}</span>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
