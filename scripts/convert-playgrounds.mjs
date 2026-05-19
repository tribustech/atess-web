import { readdir, mkdir } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(__dirname, "../../Poze/locuri_de_joaca");
const OUT_DIR = resolve(__dirname, "../public/images/playgrounds");

await mkdir(OUT_DIR, { recursive: true });

let files;
try {
  files = (await readdir(SRC_DIR))
    .filter((f) => /\.(jpe?g)$/i.test(f))
    .sort();
} catch (err) {
  if (err && err.code === "ENOENT") {
    console.error(`Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }
  throw err;
}

if (files.length === 0) {
  console.error(`No .jpeg files found in ${SRC_DIR}`);
  process.exit(1);
}

let index = 0;
for (const file of files) {
  index += 1;
  const slug = `playground-${String(index).padStart(2, "0")}`;
  const input = join(SRC_DIR, file);

  await sharp(input)
    .rotate() // honor EXIF orientation
    .webp({ quality: 82 })
    .toFile(join(OUT_DIR, `${slug}.webp`));

  await sharp(input)
    .rotate()
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(join(OUT_DIR, `${slug}-thumb.webp`));

  console.log(`✓ ${file} -> ${slug}.webp (+ thumb)`);
}

console.log(`\nDone: ${index} photos converted.`);
