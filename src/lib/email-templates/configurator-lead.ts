import type { Answers, ContactFields } from "@/app/configurator/types";

export type ConfiguratorEmailInput = {
  answers: Answers;
  originalAnswers?: Answers;
  acceptedRule?: string;
  contact: ContactFields;
};

const LABELS: Record<keyof Answers, string> = {
  projectType: "Tip proiect",
  sport: "Sport",
  useCase: "Spațiu interior",
  users: "Utilizatori",
  context: "Context",
  length: "Lungime (m)",
  width: "Lățime (m)",
  totalM2: "Suprafață (m²)",
  baseLayer: "Strat suport",
  timeline: "Termen",
  turnkeyBrief: "Brief la cheie",
};

function answersTextLines(a: Answers): string[] {
  return (Object.keys(LABELS) as (keyof Answers)[])
    .filter((k) => a[k] !== undefined && a[k] !== "")
    .map((k) => `- ${LABELS[k]}: ${a[k]}`);
}

function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildConfiguratorEmail(input: ConfiguratorEmailInput) {
  const { answers, originalAnswers, acceptedRule, contact } = input;

  const subject = `[Configurator] ${answers.projectType ?? "—"} — ${contact.name} (${contact.judet})`;

  const textLines = [
    `Lead configurator atess.ro`,
    ``,
    `=== Proiect ===`,
    ...answersTextLines(answers),
    ``,
    `=== Contact ===`,
    `- Nume: ${contact.name}`,
    `- Telefon: ${contact.phone}`,
    `- Email: ${contact.email}`,
    `- Județ: ${contact.judet}`,
    `- Termen: ${contact.deadline}`,
    contact.company ? `- Companie: ${contact.company}` : "",
    contact.note ? `- Notă: ${contact.note}` : "",
  ].filter(Boolean);

  if (acceptedRule && originalAnswers) {
    textLines.push(
      ``,
      `=== Recomandare aplicată ===`,
      `Regulă: ${acceptedRule}`,
      ...answersTextLines(originalAnswers).map((l) => `Original ${l.slice(2)}`),
    );
  }

  const text = textLines.join("\n");

  const answersRows = (Object.keys(LABELS) as (keyof Answers)[])
    .filter((k) => answers[k] !== undefined && answers[k] !== "")
    .map(
      (k) =>
        `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#666;">${escapeHtml(LABELS[k])}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${escapeHtml(answers[k])}</td></tr>`,
    )
    .join("");

  const contactRows = [
    ["Nume", contact.name],
    ["Telefon", contact.phone],
    ["Email", contact.email],
    ["Județ", contact.judet],
    ["Termen", contact.deadline],
    contact.company ? ["Companie", contact.company] : null,
    contact.note ? ["Notă", contact.note] : null,
  ]
    .filter(Boolean)
    .map(
      (pair) =>
        `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#666;">${escapeHtml((pair as string[])[0])}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${escapeHtml((pair as string[])[1])}</td></tr>`,
    )
    .join("");

  const diffSection =
    acceptedRule && originalAnswers
      ? `<h3 style="margin:24px 0 8px;color:#b45309;">Recomandare aplicată</h3>
         <p style="margin:0 0 8px;color:#666;">Regulă: <code>${escapeHtml(acceptedRule)}</code></p>
         <table style="border-collapse:collapse;width:100%;font-size:14px;">
           ${(Object.keys(LABELS) as (keyof Answers)[])
             .filter((k) => originalAnswers[k] !== undefined && originalAnswers[k] !== answers[k])
             .map(
               (k) =>
                 `<tr><td style="padding:6px 8px;color:#666;">${escapeHtml(LABELS[k])}</td><td style="padding:6px 8px;text-decoration:line-through;color:#9ca3af;">${escapeHtml(originalAnswers[k])}</td><td style="padding:6px 8px;">${escapeHtml(answers[k])}</td></tr>`,
             )
             .join("")}
         </table>`
      : "";

  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#111;">
<h2 style="margin:0 0 8px;">Lead configurator atess.ro</h2>
<p style="margin:0 0 24px;color:#666;">Trimite o ofertă de orientare prin telefon în 1 zi lucrătoare.</p>

<h3 style="margin:0 0 8px;">Proiect</h3>
<table style="border-collapse:collapse;width:100%;font-size:14px;">${answersRows}</table>

<h3 style="margin:24px 0 8px;">Contact</h3>
<table style="border-collapse:collapse;width:100%;font-size:14px;">${contactRows}</table>

${diffSection}
</body></html>`;

  return { subject, text, html };
}
