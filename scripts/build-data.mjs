// Concatenates the per-file content folders edited via the CMS back into the
// aggregate JSON files the app imports. Source of truth = the folders under
// src/data/<folder>/; the aggregate JSON files are generated artifacts.
//
// Runs automatically on `predev` and `prebuild` (and in the Vercel build
// command), so the aggregates are always rebuilt from the folders before the
// app reads them. Loaders import the aggregates unchanged, so client bundles
// keep shipping the data exactly as before.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "..", "src", "data");

// folder (per-item source) -> aggregate file the app imports.
// `normalize` backfills fields the CMS hides from the editor so the aggregate
// stays valid against the runtime schema (e.g. a new project from the CMS has
// no systemSlug — it always mirrors category).
const COLLECTIONS = [
  { folder: "articles", out: "academy.json" },
  {
    folder: "projects",
    out: "projects.json",
    normalize: (p) => ({ ...p, systemSlug: p.systemSlug ?? p.category }),
  },
  { folder: "services", out: "services.json" },
];

// Stable order: by numeric `order` when present, then by slug, then filename.
function compareEntries(a, b) {
  const ao = typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
  const bo = typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  const as = a.slug ?? "";
  const bs = b.slug ?? "";
  return as.localeCompare(bs);
}

async function buildCollection({ folder, out, normalize }) {
  const dir = join(DATA_DIR, folder);
  if (!existsSync(dir)) {
    throw new Error(`Missing data folder: ${dir}`);
  }
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  const entries = [];
  for (const file of files) {
    const raw = await readFile(join(dir, file), "utf8");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new Error(`Invalid JSON in ${folder}/${file}: ${err.message}`);
    }
    entries.push(normalize ? normalize(parsed) : parsed);
  }
  entries.sort(compareEntries);
  const outPath = join(DATA_DIR, out);
  await writeFile(outPath, JSON.stringify(entries, null, 2) + "\n", "utf8");
  return { out, count: entries.length };
}

async function main() {
  const results = [];
  for (const c of COLLECTIONS) {
    results.push(await buildCollection(c));
  }
  for (const r of results) {
    console.log(`build-data: ${r.out} ← ${r.count} entries`);
  }
}

main().catch((err) => {
  console.error("build-data failed:", err.message);
  process.exit(1);
});
