/**
 * DEV / TEMPORARY — Manual 3-D review harness for all 5 flooring systems.
 *
 * Owned by the flooring-3d plan (Task 10). Remove after Servicii plan
 * integrates the components into the mega-menu and service pages.
 *
 * Usage: `npm run dev` → http://localhost:3000/flooring-preview
 */

import dynamic from "next/dynamic";
import {
  FLOORING_SYSTEM_LIST,
  type FlooringSystemId,
} from "@/components/home/FlooringSystem/flooring-systems";
import { FlooringSystemClient } from "@/components/home/FlooringSystemClient";

export const metadata = { robots: { index: false, follow: false } };

// FlooringMiniModel is a "use client" Three.js canvas — load it without SSR.
const FlooringMiniModel = dynamic(
  () =>
    import("@/components/home/FlooringSystem/FlooringMiniModel").then(
      (m) => m.FlooringMiniModel
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 w-40 animate-pulse rounded bg-neutral-800" />
    ),
  }
);

export default function FlooringPreviewPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* ------------------------------------------------------------------ */}
      {/* DEV banner — never index, remove before launch                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky top-0 z-50 flex items-center justify-center bg-amber-500 px-4 py-2 text-center text-sm font-bold text-black">
        DEV / TEMPORARY — remove before launch. This page is noindex.
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-10">
        <h1 className="mb-2 text-2xl font-semibold">
          Flooring Systems — 3D Review Harness
        </h1>
        <p className="mb-12 text-sm text-white/50">
          Each section below renders one system via{" "}
          <code>FlooringSystemClient</code> (full section) and a row of{" "}
          <code>FlooringMiniModel</code> thumbnails (mega-menu preview). Verify
          geometry, labels, textures, and layer count for all 5 systems.
        </p>

        {FLOORING_SYSTEM_LIST.map((sys) => (
          <section
            key={sys.id}
            className="mb-24 border-b border-white/10 pb-16"
          >
            {/* System heading */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                {sys.id}
              </p>
              <h2 className="text-xl font-semibold">{sys.title}</h2>
              <p className="mt-1 text-sm text-white/50">
                {sys.layers.length} straturi (bottom → top):{" "}
                {sys.layers.map((l) => l.label).join(" · ")}
              </p>
            </div>

            {/* MiniModel thumbnail row — mega-menu preview check */}
            <div className="mb-8">
              <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
                FlooringMiniModel (autoRotate / non-interactive)
              </p>
              <div className="flex flex-wrap gap-4">
                <FlooringMiniModel
                  systemId={sys.id as FlooringSystemId}
                  autoRotate
                  interactive={false}
                />
                <FlooringMiniModel
                  systemId={sys.id as FlooringSystemId}
                  autoRotate={false}
                  interactive
                />
              </div>
            </div>

            {/* Full FlooringSystemClient section */}
            <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
              FlooringSystemClient (full section)
            </p>
            <div className="overflow-hidden rounded-lg border border-white/10">
              <FlooringSystemClient
                systemId={sys.id as FlooringSystemId}
                sectionId={`preview-${sys.id}`}
              />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
