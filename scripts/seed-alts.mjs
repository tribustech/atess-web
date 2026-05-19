import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const GALLERY_FILE = resolve(PROJECT_ROOT, "src/data/gallery.json");

const TEMPLATES = {
  "piste-atletism":
    "Pistă de atletism roșie cu marcaje World Athletics, instalată de Atess Professional Flooring",
  multisport:
    "Teren multisport cu pardoseală EPDM, marcaje pentru baschet și volei, proiect Atess",
  "locuri-joaca":
    "Loc de joacă cu pardoseală EPDM colorată, instalat de Atess Professional Flooring",
  educational:
    "Pardoseală sportivă pentru spațiu educațional, instalată de Atess",
  interioare:
    "Pardoseală PVC interioară, proiect Atess Professional Flooring",
};

const entries = JSON.parse(await readFile(GALLERY_FILE, "utf8"));

// Group by category to compute per-category indices.
const indexByCategory = new Map();
for (const entry of entries) {
  const n = (indexByCategory.get(entry.category) ?? 0) + 1;
  indexByCategory.set(entry.category, n);
  entry._index = n;
}

for (const entry of entries) {
  if (entry.alt && entry.alt.trim()) continue;
  const tmpl = TEMPLATES[entry.category];
  if (!tmpl) {
    throw new Error(`No template for category ${entry.category} on ${entry.id}`);
  }
  if (entry.category === "piste-atletism") {
    // Insert the variant before ", instalată"
    entry.alt = tmpl.replace(
      ", instalată de Atess Professional Flooring",
      ` — lucrare #${entry._index}, instalată de Atess Professional Flooring`
    );
  } else if (entry.category === "locuri-joaca") {
    // Insert the variant before ", instalat"
    entry.alt = tmpl.replace(
      ", instalat de Atess Professional Flooring",
      ` — lucrare #${entry._index}, instalat de Atess Professional Flooring`
    );
  } else {
    entry.alt = `${tmpl} — lucrare #${entry._index}`;
  }
}

// Pick featured: the piste-atletism entry with the largest pixel area.
const pisteEntries = entries.filter((e) => e.category === "piste-atletism");
pisteEntries.sort(
  (a, b) => b.width * b.height - a.width * a.height || a.id.localeCompare(b.id)
);
const featuredId = pisteEntries[0]?.id;
if (!featuredId) {
  throw new Error("No piste-atletism entry to feature.");
}
for (const entry of entries) {
  if (entry.id === featuredId) {
    entry.featured = true;
    entry.alt =
      "Pistă de atletism profesională cu 8 culoare și marcaje World Athletics, lucrare de referință Atess Professional Flooring";
    entry.caption = "Pistă atletism, vedere de ansamblu";
  } else {
    delete entry.featured;
  }
  delete entry._index;
}

await writeFile(GALLERY_FILE, JSON.stringify(entries, null, 2) + "\n");
console.log(`Updated ${entries.length} entries. Featured: ${featuredId}`);
