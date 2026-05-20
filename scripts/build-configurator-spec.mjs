#!/usr/bin/env node
// Generates docs/configurator-spec.pdf — a client-shareable document with the
// wizard flow, step options, and rule messages, in plain Romanian.
//
// Requires: Google Chrome at the default macOS location. No npm deps.

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const RULES_PATH = join(ROOT, "src/data/configurator-rules.json");
const OUT_DIR = join(ROOT, "docs");
const OUT_PDF = join(OUT_DIR, "configurator-spec.pdf");

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// ---- Steps (client-friendly) -----------------------------------------------

const STEPS = [
  {
    number: 1,
    title: "Ce vrei să construiești?",
    note: "Pornim de la tipul proiectului — toate întrebările următoare se adaptează la alegerea de aici.",
    options: [
      "Pistă de atletism",
      "Teren multisport / bază CNI",
      "Teren individual de sport",
      "Loc de joacă",
      "Spațiu public / gazon sintetic",
      "Pardoseală interioară",
      "Construcție la cheie",
    ],
  },
  {
    number: 2,
    title: "Ce sport se va practica?",
    note: "Apare doar dacă alegi „teren individual de sport”.",
    options: ["Baschet", "Tenis", "Fotbal", "Volei", "Mai multe sporturi", "Altele / nu sunt sigur"],
  },
  {
    number: 3,
    title: "Ce dimensiuni are suprafața?",
    note: "Lungime și lățime în metri. Calculăm automat suprafața totală.",
    options: ["Lungime (m)", "Lățime (m)"],
  },
  {
    number: 4,
    title: "Cine va folosi suprafața?",
    note: "Apare la terenuri individuale și la locuri de joacă. Ajută la alegerea grosimii și a sistemului.",
    options: [
      "Copii mici (sub 12 ani)",
      "Copii mari (12–16 ani)",
      "Adolescenți / liceeni",
      "Adulți",
      "Mixt / public general",
    ],
  },
  {
    number: 5,
    title: "Unde va fi amplasată?",
    note: "Contextul ne spune cât de rezistent trebuie să fie sistemul.",
    options: ["Privat, supravegheat", "Public, supravegheat", "Public, nesupravegheat"],
  },
  {
    number: 6,
    title: "Ce tip de spațiu interior?",
    note: "Apare doar pentru pardoselile interioare — fiecare destinație are cerințe diferite.",
    options: [
      "Spital / unitate medicală",
      "Birou / spațiu corporate",
      "Spațiu comercial",
      "Spațiu educațional",
      "Locuință",
    ],
  },
  {
    number: 7,
    title: "Descrie pe scurt proiectul „la cheie”",
    note: "Pentru construcție la cheie sărim întrebările tehnice și colectăm un brief liber.",
    options: ["Câmp text descriptiv"],
  },
  {
    number: 8,
    title: "Ce fundație există pe șantier?",
    note: "Determină dacă mai trebuie turnat un strat suport înainte de pardoseală.",
    options: [
      "Beton existent",
      "Asfalt existent",
      "Pământ / pietriș",
      "Nicio fundație (turnăm noi)",
      "Nu știu sigur",
    ],
  },
  {
    number: 9,
    title: "Când vrei să începi?",
    note: "Orizontul de timp ne ajută să prioritizăm și să planificăm.",
    options: ["Sub 3 luni", "3 – 12 luni", "Peste 1 an", "Nu știu încă"],
  },
  {
    number: 10,
    title: "Datele tale de contact",
    note: "Ultimul pas — îți trimitem oferta inițială în max. 1 zi lucrătoare.",
    options: [
      "Nume",
      "Telefon",
      "Email",
      "Județ",
      "Termen de execuție",
      "Companie / instituție (opțional)",
      "Note suplimentare (opțional)",
      "Atașamente PDF / JPG / PNG (max. 3 fișiere, 9 MB total)",
    ],
  },
  {
    number: 11,
    title: "Confirmare",
    note: "Cererea a fost trimisă — te sunăm în max. 1 zi lucrătoare.",
    options: [],
  },
];

// ---- 7 trasee (paths) — one per project type --------------------------------

const PATHS = [
  {
    type: "Pistă de atletism",
    note: "Pentru piste de alergare, stadioane, baze sportive.",
    steps: ["Tipul proiectului", "Dimensiuni", "Fundație", "Calendar", "Contact", "Confirmare"],
  },
  {
    type: "Teren multisport / bază CNI",
    note: "Pentru terenuri cu mai multe sporturi pe aceeași suprafață.",
    steps: ["Tipul proiectului", "Dimensiuni", "Context", "Fundație", "Calendar", "Contact", "Confirmare"],
  },
  {
    type: "Teren individual de sport",
    note: "Pentru un singur sport — baschet, tenis, fotbal etc.",
    steps: [
      "Tipul proiectului",
      "Sport",
      "Dimensiuni",
      "Utilizatori",
      "Context",
      "Fundație",
      "Calendar",
      "Contact",
      "Confirmare",
    ],
  },
  {
    type: "Loc de joacă",
    note: "Pentru creșe, grădinițe, parcuri, zone safe pentru copii.",
    steps: ["Tipul proiectului", "Utilizatori", "Context", "Fundație", "Calendar", "Contact", "Confirmare"],
  },
  {
    type: "Spațiu public / gazon sintetic",
    note: "Pentru miniterenuri comunale, parcuri, amenajări urbane.",
    steps: ["Tipul proiectului", "Dimensiuni", "Fundație", "Calendar", "Contact", "Confirmare"],
  },
  {
    type: "Pardoseală interioară",
    note: "Pentru birouri, spitale, comercial, educațional, locuințe.",
    steps: ["Tipul proiectului", "Mediu interior", "Fundație", "Calendar", "Contact", "Confirmare"],
  },
  {
    type: "Construcție la cheie",
    note: "De la concept la predare — colectăm un brief liber și trecem direct la contact.",
    steps: ["Tipul proiectului", "Brief la cheie", "Contact", "Confirmare"],
  },
];

// ---- Helpers for translating rule conditions into Romanian prose ------------

const PROJECT_TYPE_LABEL = {
  "pista-atletism": "pistă de atletism",
  multisport: "teren multisport",
  "teren-individual": "teren individual de sport",
  "loc-joaca": "loc de joacă",
  "spatii-publice": "spațiu public / gazon sintetic",
  interior: "pardoseală interioară",
  "constructii-cheie": "construcție la cheie",
};

const SPORT_LABEL = {
  basket: "baschet",
  tenis: "tenis",
  fotbal: "fotbal",
  volei: "volei",
  multi: "mai multe sporturi",
  altele: "alt sport",
};

const USERS_LABEL = {
  "copii-mici": "copii sub 12 ani",
  "copii-mari": "copii de 12–16 ani",
  adolescenti: "adolescenți / liceeni",
  adulti: "adulți",
  mixt: "public mixt",
};

const CONTEXT_LABEL = {
  "privat-supervizat": "spațiu privat, supravegheat",
  "public-supervizat": "spațiu public, supravegheat",
  "public-nesupervizat": "spațiu public, nesupravegheat",
};

const USECASE_LABEL = {
  spital: "spital sau unitate medicală",
  birou: "birou / spațiu corporate",
  comercial: "spațiu comercial",
  educational: "spațiu educațional",
  locuinta: "locuință",
};

const BASE_LAYER_LABEL = {
  beton: "beton existent",
  asfalt: "asfalt existent",
  pamant: "pământ / pietriș",
  niciuna: "nicio fundație existentă",
  "nu-stiu": "fundație neștiută",
};

function describeWhen(cond) {
  const parts = [];
  if (cond.projectType) parts.push(`a ales <strong>${PROJECT_TYPE_LABEL[cond.projectType] ?? cond.projectType}</strong>`);
  if (cond.sport) parts.push(`a ales sportul <strong>${SPORT_LABEL[cond.sport] ?? cond.sport}</strong>`);
  if (cond.users) parts.push(`utilizatorii sunt <strong>${USERS_LABEL[cond.users] ?? cond.users}</strong>`);
  if (cond.context) parts.push(`amplasarea e în <strong>${CONTEXT_LABEL[cond.context] ?? cond.context}</strong>`);
  if (cond.useCase) parts.push(`spațiul interior e <strong>${USECASE_LABEL[cond.useCase] ?? cond.useCase}</strong>`);
  if (cond.baseLayer) parts.push(`fundația e <strong>${BASE_LAYER_LABEL[cond.baseLayer] ?? cond.baseLayer}</strong>`);
  if (typeof cond.lengthBelow === "number") parts.push(`lungimea introdusă e sub <strong>${cond.lengthBelow} m</strong>`);
  if (typeof cond.totalM2Below === "number") parts.push(`suprafața totală e sub <strong>${cond.totalM2Below} m²</strong>`);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return `Clientul ${parts[0]}.`;
  const last = parts.pop();
  return `Clientul ${parts.join(", ")} și ${last}.`;
}

function describeEffect(rewrite) {
  if (!rewrite) return "Recomandare informativă — configuratorul continuă pe traseul ales.";
  const change = Object.entries(rewrite)
    .map(([k, v]) => {
      if (k === "projectType") return `traseul „${PROJECT_TYPE_LABEL[v] ?? v}”`;
      return `${k} = ${v}`;
    })
    .join(", ");
  return `Dacă acceptă, configuratorul comută pe ${change}.`;
}

// ---- HTML builder ----------------------------------------------------------

function buildHtml({ rules }) {
  const today = new Date().toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pathsHtml = PATHS.map((p) => {
    const pillsHtml = p.steps
      .map((s, i) => {
        const cls =
          i === 0 ? "lane-step start" : i === p.steps.length - 1 ? "lane-step end" : "lane-step";
        const arrow =
          i < p.steps.length - 1 ? `<span class="lane-arrow">→</span>` : "";
        return `<span class="${cls}">${s}</span>${arrow}`;
      })
      .join("");
    return `<section class="lane">
      <header class="lane-header">
        <span class="lane-title">${p.type}</span>
        <span class="lane-count">${p.steps.length} pași</span>
      </header>
      <p class="lane-note">${p.note}</p>
      <div class="lane-steps">${pillsHtml}</div>
    </section>`;
  }).join("\n");

  const stepsHtml = STEPS.map(
    (s) => `<section class="step">
      <header><span class="num">${s.number}</span><h3>${s.title}</h3></header>
      <p class="note">${s.note}</p>
      ${
        s.options.length
          ? `<ul class="opts">${s.options.map((o) => `<li>${o}</li>`).join("")}</ul>`
          : ""
      }
    </section>`
  ).join("\n");

  const recsHtml = rules
    .map((r, i) => {
      const t = r.then;
      const detailHtml = t.detail
        ? `<div class="rec-row"><span class="lbl">Context tehnic</span><p class="long">${t.detail}</p></div>`
        : "";
      return `<article class="rec">
        <header><span class="num">${i + 1}</span><h3>${t.title ?? t.suggest ?? r.id}</h3></header>
        <div class="rec-row"><span class="lbl">Situație</span><p>${describeWhen(r.if)}</p></div>
        <div class="rec-row"><span class="lbl">Ce afișează configuratorul</span><p>„${t.message}”</p></div>
        ${detailHtml}
        <div class="rec-row"><span class="lbl">Efect</span><p class="muted">${describeEffect(t.rewriteAnswers)}</p></div>
      </article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8" />
<title>Configurator ATESS</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #1a1a1a;
    font-size: 11pt;
    line-height: 1.5;
  }
  h1 { font-size: 26pt; margin: 0 0 6pt; letter-spacing: -0.01em; }
  h2 {
    font-size: 17pt;
    margin: 0 0 14pt;
    padding-bottom: 6pt;
    border-bottom: 2px solid #C8102E;
  }
  h3 {
    font-size: 12.5pt;
    margin: 0;
    color: #1a1a1a;
  }

  /* Cover */
  .cover {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 240mm;
  }
  .eyebrow {
    font-size: 9pt;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #C8102E;
    margin-bottom: 14pt;
  }
  .subtitle {
    font-size: 13pt;
    color: #444;
    line-height: 1.55;
    margin: 10pt 0 0;
    max-width: 140mm;
  }
  .meta {
    margin-top: 32pt;
    font-size: 9pt;
    color: #999;
  }

  /* Generic section */
  .section { page-break-before: always; }
  .intro {
    background: #fafafa;
    border-left: 3px solid #C8102E;
    padding: 12pt 14pt;
    margin: 0 0 18pt;
    border-radius: 3pt;
    font-size: 11pt;
    color: #333;
  }
  .intro p { margin: 0 0 6pt; }
  .intro p:last-child { margin-bottom: 0; }
  .lead {
    margin: 0 0 14pt;
    color: #555;
    font-size: 10.5pt;
  }

  /* Lane / path */
  .lane {
    margin: 0 0 10pt;
    padding: 10pt 14pt;
    border: 1px solid #e4e4e4;
    border-left: 3px solid #C8102E;
    border-radius: 4pt;
    page-break-inside: avoid;
  }
  .lane-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2pt;
  }
  .lane-title { font-weight: 600; font-size: 11.5pt; color: #1a1a1a; }
  .lane-count {
    font-size: 9pt;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .lane-note {
    font-size: 9.5pt;
    color: #666;
    margin: 0 0 8pt;
    font-style: italic;
  }
  .lane-steps {
    display: flex;
    flex-wrap: wrap;
    gap: 3pt 0;
    align-items: center;
    line-height: 1.9;
  }
  .lane-step {
    display: inline-block;
    background: #f7f7f8;
    border: 1px solid #d8d8d8;
    border-radius: 3pt;
    padding: 2.5pt 7pt;
    font-size: 9.5pt;
    color: #333;
  }
  .lane-step.start {
    background: #fdecef;
    border-color: #C8102E;
    color: #C8102E;
    font-weight: 600;
  }
  .lane-step.end {
    background: #e8f4ec;
    border-color: #0E3F1E;
    color: #0E3F1E;
    font-weight: 600;
  }
  .lane-arrow {
    color: #C8102E;
    font-weight: 700;
    margin: 0 6pt;
  }

  /* Step + Recommendation cards */
  .step, .rec {
    margin: 0 0 14pt;
    padding: 12pt 14pt;
    border: 1px solid #e4e4e4;
    border-left: 3px solid #C8102E;
    border-radius: 4pt;
    page-break-inside: avoid;
  }
  .step header, .rec header {
    display: flex;
    align-items: center;
    gap: 10pt;
    margin-bottom: 6pt;
  }
  .num {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22pt;
    height: 22pt;
    border-radius: 50%;
    background: #C8102E;
    color: white;
    font-size: 10pt;
    font-weight: 600;
  }
  .note {
    margin: 0 0 8pt;
    color: #666;
    font-style: italic;
    font-size: 10.5pt;
  }
  .opts {
    margin: 0;
    padding-left: 16pt;
    columns: 2;
    column-gap: 18pt;
  }
  .opts li {
    margin: 0 0 3pt;
    break-inside: avoid;
  }

  /* Recommendation rows */
  .rec-row {
    display: grid;
    grid-template-columns: 28mm 1fr;
    gap: 8pt;
    margin-top: 6pt;
    align-items: baseline;
  }
  .rec-row .lbl {
    font-size: 8.5pt;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #888;
    padding-top: 2pt;
  }
  .rec-row p { margin: 0; font-size: 10.5pt; }
  .rec-row p.long { font-size: 10pt; line-height: 1.55; color: #333; }
  .rec-row .muted { color: #666; font-style: italic; }
</style>
</head>
<body>
  <div class="cover">
    <p class="eyebrow">ATESS Professional Flooring</p>
    <h1>Configuratorul de oferte</h1>
    <p class="subtitle">Un instrument interactiv care îl ghidează pe client de la „ce vrea să construiască” până la o cerere de ofertă completă — cu sugestii inteligente pe parcurs, atunci când există o variantă mai potrivită pentru situația lui.</p>
    <p class="meta">${today}</p>
  </div>

  <section class="section">
    <h2>Cum funcționează</h2>
    <div class="intro">
      <p><strong>Configuratorul îl întreabă pas cu pas</strong> pe client ce vrea să construiască, ce dimensiuni are, unde va fi amplasat și ce fundație există. La final colectează datele de contact și trimite cererea pe email.</p>
      <p><strong>Întrebările se adaptează automat</strong> la răspunsuri. Cineva care alege „loc de joacă” nu mai e întrebat ce sport va practica. Cineva care alege „construcție la cheie” sare peste întrebările tehnice și completează un brief liber.</p>
      <p><strong>Pe parcurs apar recomandări.</strong> Dacă din răspunsuri reiese că o altă variantă i s-ar potrivi mai bine, o aducem în discuție cu un mesaj prietenos — fără să forțăm alegerea.</p>
    </div>

    <h3 style="margin-top:18pt;margin-bottom:8pt;">Pașii, în funcție de ce alege clientul</h3>
    <p class="lead">Mai jos sunt cele <strong>7 trasee</strong> posibile prin configurator. Fiecare client urmează unul singur — cel corespunzător tipului de proiect ales la prima întrebare.</p>
    ${pathsHtml}
  </section>

  <section class="section">
    <h2>Toate întrebările, în detaliu</h2>
    <p class="lead">Mai jos sunt toate cele 11 ecrane care pot apărea, în ordinea în care se afișează. Unele apar doar pentru anumite trasee.</p>
    ${stepsHtml}
  </section>

  <section class="section">
    <h2>Recomandările pe care le facem</h2>
    <p class="lead">Configuratorul urmărește răspunsurile și, când recunoaște o situație în care există o variantă mai potrivită, afișează o sugestie. Clientul poate aplica recomandarea sau poate continua cu alegerea sa inițială — nimic nu se schimbă fără confirmarea lui.</p>
    ${recsHtml}
  </section>
</body>
</html>
`;
}

// ---- PDF -------------------------------------------------------------------

function renderHtmlToPdf(htmlPath, pdfPath) {
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ];
  const r = spawnSync(CHROME, args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`Chrome exited with code ${r.status}`);
}

function main() {
  const rules = JSON.parse(readFileSync(RULES_PATH, "utf8"));
  const html = buildHtml({ rules });

  mkdirSync(OUT_DIR, { recursive: true });
  const htmlPath = join(tmpdir(), `configurator-spec-${Date.now()}.html`);
  writeFileSync(htmlPath, html, "utf8");

  renderHtmlToPdf(htmlPath, OUT_PDF);

  try {
    rmSync(htmlPath);
  } catch {}

  console.log(`Wrote ${OUT_PDF}`);
}

main();
