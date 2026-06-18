/**
 * INTERN / NOINDEX — Jurnal al modificărilor pentru redesign-ul ATESS.
 * Prezentare pentru client: grupează cererile lui Teo cu înainte/după.
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
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 bg-neutral-900 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-500/70" />
            <span className="text-xs font-medium text-neutral-400">Înainte</span>
          </div>
          <div className="bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforeImage}
              alt="Înainte"
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-neutral-950 p-8 text-center">
          <p className="text-xs text-neutral-500">
            Element nou —<br />
            nu există versiune anterioară
          </p>
        </div>
      )}

      {afterImage ? (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 bg-neutral-900 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            <span className="text-xs font-medium text-neutral-400">După</span>
          </div>
          <div className="bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afterImage}
              alt="După"
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChangeCard({ entry }: { entry: ChangeEntry }) {
  return (
    <div className="rounded-xl border border-white/8 bg-neutral-900/50 p-5">
      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{entry.clientAsk}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <TimestampChip timestamp={entry.timestamp} />
          <StatusBadge status={entry.status} />
        </div>
      </div>

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
        <div className="mb-1">
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
        </div>
      )}

      {/* Before / After images */}
      <ImageComparison
        beforeImage={entry.beforeImage}
        afterImage={entry.afterImage}
      />
    </div>
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
    <section className="mb-16">
      {/* Section heading */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h2 className="text-lg font-semibold text-white">{sectionName}</h2>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {doneCount > 0 && (
            <span className="text-emerald-400">{doneCount} implementat{doneCount !== 1 ? "e" : ""}</span>
          )}
          {partialCount > 0 && (
            <span className="text-amber-400">{partialCount} parțial{partialCount !== 1 ? "e" : ""}</span>
          )}
          {needsAssetCount > 0 && (
            <span className="text-sky-400">{needsAssetCount} în așteptare</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <ChangeCard key={entry.id} entry={entry} />
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
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            ATESS Project · Redesign 2025
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight">
            Jurnalul modificărilor
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-400">
            Această pagină documentează toate modificările realizate în cadrul
            redesign-ului site-ului ATESS Project, grupate pe arii tematice
            conform solicitărilor discutate. Fiecare intrare include cererea
            originală, citatul relevant din sesiunea de feedback și ce a fost
            implementat.
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
        <div className="mb-12 border-t border-white/8" />

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
