export type ContactEmailInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source?: string;
};

function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildContactEmail(input: ContactEmailInput) {
  const { name, email, phone, subject, message, source } = input;

  const emailSubject = `[Contact] ${subject?.trim() || "Mesaj nou"} — ${name}`;

  const text = [
    `Mesaj nou de pe atess.ro/contact`,
    ``,
    `=== Expeditor ===`,
    `- Nume: ${name}`,
    `- Email: ${email}`,
    phone ? `- Telefon: ${phone}` : "",
    subject ? `- Subiect: ${subject}` : "",
    source ? `- Sursă: ${source}` : "",
    ``,
    `=== Mesaj ===`,
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const rows = [
    ["Nume", name],
    ["Email", email],
    phone ? ["Telefon", phone] : null,
    subject ? ["Subiect", subject] : null,
    source ? ["Sursă", source] : null,
  ]
    .filter(Boolean)
    .map(
      (pair) =>
        `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#666;">${escapeHtml(
          (pair as string[])[0],
        )}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${escapeHtml(
          (pair as string[])[1],
        )}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#111;">
<h2 style="margin:0 0 8px;">Mesaj nou de pe atess.ro/contact</h2>
<p style="margin:0 0 24px;color:#666;">Răspunde direct la acest email — câmpul Reply-To este setat la expeditor.</p>

<h3 style="margin:0 0 8px;">Expeditor</h3>
<table style="border-collapse:collapse;width:100%;font-size:14px;">${rows}</table>

<h3 style="margin:24px 0 8px;">Mesaj</h3>
<div style="white-space:pre-wrap;padding:12px;background:#f7f7f5;border-left:3px solid #C8102E;font-size:14px;line-height:1.6;">${escapeHtml(message)}</div>
</body></html>`;

  return { subject: emailSubject, text, html };
}
