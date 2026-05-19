import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const IMAGES_DIR = resolve(PROJECT_ROOT, "public/images");
const OUT_FILE = resolve(PROJECT_ROOT, "src/data/gallery.json");

const DENYLIST = new Set([
  "atess-logo.png",
  "hero.png",
  "logo-bg.png",
]);
const NUMERIC_WEBP = /^\d+\.webp$/;

const DEFAULT_CATEGORY = "piste-atletism";
const PLAYGROUND_CATEGORY = "locuri-joaca";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function deriveId(srcPath) {
  const name = basename(srcPath).replace(/\.webp$/, "");
  return name.split("-")[0];
}

function inferCategory(srcPath, existing) {
  if (existing?.category) return existing.category;
  if (srcPath.includes("/playgrounds/")) return PLAYGROUND_CATEGORY;
  return DEFAULT_CATEGORY;
}

async function lqip(file) {
  const buf = await sharp(file)
    .resize({ width: 16 })
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

function isThumb(file) {
  return /-thumb\.webp$/.test(file);
}

function isExcluded(file) {
  const name = basename(file);
  if (DENYLIST.has(name)) return true;
  if (NUMERIC_WEBP.test(name)) return true;
  return false;
}

async function main() {
  const allFiles = await walk(IMAGES_DIR);
  const fullWebps = allFiles
    .filter((f) => f.endsWith(".webp"))
    .filter((f) => !isThumb(f))
    .filter((f) => !isExcluded(f));

  const existing = existsSync(OUT_FILE)
    ? JSON.parse(await readFile(OUT_FILE, "utf8"))
    : [];
  const existingById = new Map(existing.map((e) => [e.id, e]));

  const excluded = allFiles
    .filter((f) => f.endsWith(".webp") && !isThumb(f) && isExcluded(f))
    .map((f) => relative(IMAGES_DIR, f));
  if (excluded.length) {
    console.log("Excluded (denylist):", excluded.join(", "));
  }

  const entries = [];
  for (const file of fullWebps) {
    const thumb = file.replace(/\.webp$/, "-thumb.webp");
    if (!existsSync(thumb)) {
      console.warn(`⚠ Skipping ${relative(PROJECT_ROOT, file)}: no matching -thumb.webp`);
      continue;
    }

    const id = deriveId(file);
    const prior = existingById.get(id);

    const meta = await sharp(file).metadata();
    const blurDataURL = await lqip(file);

    const publicPath = "/" + relative(resolve(PROJECT_ROOT, "public"), file).replace(/\\/g, "/");
    const thumbPath = "/" + relative(resolve(PROJECT_ROOT, "public"), thumb).replace(/\\/g, "/");

    entries.push({
      id,
      src: publicPath,
      thumb: thumbPath,
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      blurDataURL,
      alt: prior?.alt ?? "",
      category: inferCategory(file, prior),
      caption: prior?.caption,
      projectSlug: prior?.projectSlug,
      featured: prior?.featured,
    });
  }

  entries.sort((a, b) => a.id.localeCompare(b.id));

  await writeFile(OUT_FILE, JSON.stringify(entries, null, 2) + "\n");
  console.log(`\nWrote ${entries.length} entries to ${relative(PROJECT_ROOT, OUT_FILE)}.`);

  const missingAlt = entries.filter((e) => !e.alt).length;
  if (missingAlt > 0) {
    console.log(`⚠ ${missingAlt} entries have empty alt — fill these before shipping.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
