/**
 * INTERN / NOINDEX — Jurnal al modificărilor pentru redesign-ul ATESS.
 * Prezentare pentru client: grupează cererile lui Teo cu înainte/după.
 *
 * Fiecare modificare este un acordeon (<details>) — restrâns implicit pentru
 * scanare rapidă, extins pentru a vedea citatul, ce s-a făcut și înainte/după.
 * Folosim acordeonul ca instrument de lucru: mergem secțiune cu secțiune și
 * îmbunătățim fiecare intrare de aici.
 *
 * Nu indexa, nu lansa în producție ca pagină publică.
 */

import { Metadata } from "next";
import {
  changes,
  changesBySection,
  sectionOrder,
  type ChangeEntry,
  type ChangeStatus,
} from "@/data/changes";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "ATESS — Jurnalul modificărilor",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ChangeStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  done: {
    label: "Implementat",
    bg: "bg-emerald-950",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  partial: {
    label: "Parțial",
    bg: "bg-amber-950",
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
  "needs-asset": {
    label: "Așteaptă material de la Teo",
    bg: "bg-sky-950",
    text: "text-sky-300",
    dot: "bg-sky-400",
  },
};

function StatusBadge({ status }: { status: ChangeStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function TimestampChip({ timestamp }: { timestamp: string }) {
  return (
    <span className="inline-block rounded bg-neutral-800 px-2 py-0.5 font-mono text-xs text-neutral-400">
      {timestamp}
    </span>
  );
}

function ImagePane({
  src,
  label,
  dot,
}: {
  src: string;
  label: string;
  dot: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-neutral-900 px-3 py-2">
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          <span className="text-xs font-medium text-neutral-400">{label}</span>
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-neutral-500 underline-offset-2 hover:text-neutral-300 hover:underline"
        >
          deschide
        </a>
      </div>
      {/* Tall full-page captures — scroll within the pane so the card stays compact */}
      <div className="max-h-[520px] overflow-y-auto bg-neutral-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} className="w-full" loading="lazy" />
      </div>
    </div>
  );
}

function ImageComparison({
  beforeImage,
  afterImage,
}: {
  beforeImage?: string;
  afterImage?: string;
}) {
  if (!beforeImage && !afterImage) return null;

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {beforeImage ? (
        <ImagePane src={beforeImage} label="Înainte" dot="bg-red-500/70" />
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-neutral-950 p-8 text-center">
          <p className="text-xs text-neutral-500">
            Element nou —<br />
            nu există versiune anterioară
          </p>
        </div>
      )}

      {afterImage ? (
        <ImagePane src={afterImage} label="După" dot="bg-emerald-500/70" />
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-neutral-950 p-8 text-center">
          <p className="text-xs text-neutral-500">Captură în pregătire</p>
        </div>
      )}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ChangeAccordion({ entry }: { entry: ChangeEntry }) {
  const cfg = STATUS_CONFIG[entry.status];
  return (
    <details
      id={entry.id}
      className="group overflow-hidden rounded-xl border border-white/8 bg-neutral-900/50 transition-colors open:border-white/15 open:bg-neutral-900/80 scroll-mt-20"
    >
      {/* Summary row — always visible, click to toggle */}
      <summary className="flex cursor-pointer list-none items-start gap-3 p-5 [&::-webkit-details-marker]:hidden">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{entry.clientAsk}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <TimestampChip timestamp={entry.timestamp} />
            <StatusBadge status={entry.status} />
          </div>
        </div>
        <Chevron />
      </summary>

      {/* Expanded body */}
      <div className="border-t border-white/8 px-5 pb-5 pt-4">
        {/* Quote */}
        <blockquote className="mb-4 border-l-2 border-white/20 pl-3 text-sm italic text-neutral-400">
          &ldquo;{entry.quote}&rdquo;
        </blockquote>

        {/* What changed */}
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Ce am făcut
          </p>
          <p className="text-sm leading-relaxed text-neutral-300">
            {entry.whatChanged}
          </p>
        </div>

        {/* Live route link */}
        {entry.route && (
          <a
            href={entry.route}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-white/20 hover:text-white"
          >
            <svg
              className="h-3.5 w-3.5 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Vezi pagina
            <span className="font-mono text-neutral-500">{entry.route}</span>
          </a>
        )}

        {/* Before / After images */}
        <ImageComparison
          beforeImage={entry.beforeImage}
          afterImage={entry.afterImage}
        />
      </div>
    </details>
  );
}

function SectionBlock({
  sectionName,
  entries,
}: {
  sectionName: string;
  entries: ChangeEntry[];
}) {
  const doneCount = entries.filter((e) => e.status === "done").length;
  const partialCount = entries.filter((e) => e.status === "partial").length;
  const needsAssetCount = entries.filter(
    (e) => e.status === "needs-asset"
  ).length;

  return (
    <section className="mb-12">
      {/* Section heading */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <h2 className="text-lg font-semibold text-white">{sectionName}</h2>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {doneCount > 0 && (
            <span className="text-emerald-400">
              {doneCount} implementat{doneCount !== 1 ? "e" : ""}
            </span>
          )}
          {partialCount > 0 && (
            <span className="text-amber-400">
              {partialCount} parțial{partialCount !== 1 ? "e" : ""}
            </span>
          )}
          {needsAssetCount > 0 && (
            <span className="text-sky-400">{needsAssetCount} în așteptare</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <ChangeAccordion key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ChangesPage() {
  const totalEntries = changes.length;
  const doneTotal = changes.filter((e) => e.status === "done").length;
  const partialTotal = changes.filter((e) => e.status === "partial").length;
  const needsAssetTotal = changes.filter(
    (e) => e.status === "needs-asset"
  ).length;

  const orderedSections = sectionOrder.filter(
    (s) => changesBySection[s]?.length
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* DEV banner */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-center text-sm font-bold text-black">
        <span>INTERN / NOINDEX</span>
        <span className="opacity-50">·</span>
        <span className="font-normal opacity-80">
          Pagină internă — nu este indexată și nu apare în navigație
        </span>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        {/* Page header */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            ATESS Project · Redesign 2025
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight">
            Jurnalul modificărilor
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-400">
            Această pagină documentează toate modificările realizate în cadrul
            redesign-ului site-ului ATESS Project, grupate pe arii tematice
            conform solicitărilor discutate. Apasă pe orice intrare pentru a
            vedea cererea originală, citatul din sesiunea de feedback, ce a fost
            implementat și comparația înainte/după.
          </p>

          {/* Summary stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-white">{totalEntries}</p>
              <p className="text-xs text-neutral-500">modificări totale</p>
            </div>
            <div className="rounded-lg border border-emerald-900 bg-emerald-950 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-emerald-300">{doneTotal}</p>
              <p className="text-xs text-emerald-600">implementate</p>
            </div>
            <div className="rounded-lg border border-amber-900 bg-amber-950 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-amber-300">{partialTotal}</p>
              <p className="text-xs text-amber-600">parțial implementate</p>
            </div>
            <div className="rounded-lg border border-sky-900 bg-sky-950 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-sky-300">{needsAssetTotal}</p>
              <p className="text-xs text-sky-600">așteaptă material Teo</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Implementat complet
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Parțial — logica e pregătită, detalii în finisare
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              Construit cu placeholder — Teo furnizează materialul final
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 border-t border-white/8" />

        {/* Sections */}
        {orderedSections.map((sectionName) => (
          <SectionBlock
            key={sectionName}
            sectionName={sectionName}
            entries={changesBySection[sectionName]}
          />
        ))}
      </div>
    </main>
  );
}
