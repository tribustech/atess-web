import { readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SRC_DIR = "../Poze/locuri_de_joaca";
const OUT_DIR = "public/images/playgrounds";

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR))
  .filter((f) => /\.(jpe?g)$/i.test(f))
  .sort();

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
