/**
 * DEV / TEMPORARY — Manual 3-D review harness for all 5 flooring systems.
 *
 * Owned by the flooring-3d plan (Task 10). Remove after Servicii plan
 * integrates the components into the mega-menu and service pages.
 *
 * Usage: `npm run dev` → http://localhost:3000/flooring-preview
 *
 * The interactive body lives in `FlooringPreviewBody` (a Client Component)
 * because `dynamic(..., { ssr: false })` is not allowed in a Server Component.
 */

import { FlooringPreviewBody } from "./FlooringPreviewBody";

export const metadata = { robots: { index: false, follow: false } };

export default function FlooringPreviewPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* DEV banner — never index, remove before launch */}
      <div className="sticky top-0 z-50 flex items-center justify-center bg-amber-500 px-4 py-2 text-center text-sm font-bold text-black">
        DEV / TEMPORARY — remove before launch. This page is noindex.
      </div>
      <FlooringPreviewBody />
    </main>
  );
}
