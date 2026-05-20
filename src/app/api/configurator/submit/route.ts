import { NextResponse } from "next/server";
import { z } from "zod";
import { getConfiguratorEnvStatus } from "@/lib/configurator-env";
import { getPostmark } from "@/lib/postmark";
import { buildConfiguratorEmail } from "@/lib/email-templates/configurator-lead";
import { checkRateLimit } from "./rate-limit";

const AnswersSchema = z.object({
  projectType: z.string().optional(),
  sport: z.string().optional(),
  useCase: z.string().optional(),
  users: z.string().optional(),
  context: z.string().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  totalM2: z.number().optional(),
  baseLayer: z.string().optional(),
  timeline: z.string().optional(),
  turnkeyBrief: z.string().max(2000).optional(),
});

const PayloadSchema = z.object({
  answers: AnswersSchema,
  originalAnswers: AnswersSchema.optional(),
  acceptedRule: z.string().optional(),
  contact: z.object({
    name: z.string().min(2).max(80),
    phone: z.string().regex(/^(\+4)?0[2-7][0-9]{8}$/),
    email: z.string().email(),
    judet: z.string().min(2).max(40),
    deadline: z.enum(["sub-3-luni", "3-12-luni", "peste-1-an", "nu-stiu"]),
    company: z.string().max(80).optional(),
    note: z.string().max(1500).optional(),
  }),
  website: z.string().optional(), // honeypot
});

const MAX_TOTAL_BYTES = 9 * 1024 * 1024;

function getIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

export async function POST(req: Request) {
  const env = getConfiguratorEnvStatus();
  if (!env.ok) {
    console.warn(
      "[configurator] missing env vars:",
      env.missing.join(", "),
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_form" },
      { status: 400 },
    );
  }

  const payloadRaw = form.get("payload");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json(
      { ok: false, code: "missing_payload" },
      { status: 400 },
    );
  }

  let payload: z.infer<typeof PayloadSchema>;
  try {
    payload = PayloadSchema.parse(JSON.parse(payloadRaw));
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        code: "validation_failed",
        issues: err instanceof z.ZodError ? err.issues : undefined,
      },
      { status: 400 },
    );
  }

  // Honeypot — return 200 but skip sending
  if (payload.website && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Rate limit
  const ip = getIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, code: "rate_limited" },
      { status: 429 },
    );
  }

  // Attachments
  const files = form.getAll("files").filter((v): v is File => v instanceof File);
  let totalBytes = 0;
  for (const f of files) totalBytes += f.size;
  if (totalBytes > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { ok: false, code: "attachment_too_large" },
      { status: 413 },
    );
  }

  const attachments = await Promise.all(
    files.map(async (f) => ({
      Name: f.name,
      ContentType: f.type || "application/octet-stream",
      Content: Buffer.from(await f.arrayBuffer()).toString("base64"),
      ContentID: null,
    })),
  );

  const email = buildConfiguratorEmail({
    answers: payload.answers as Parameters<typeof buildConfiguratorEmail>[0]["answers"],
    originalAnswers: payload.originalAnswers as Parameters<typeof buildConfiguratorEmail>[0]["originalAnswers"],
    acceptedRule: payload.acceptedRule,
    contact: payload.contact,
  });

  try {
    const pm = getPostmark();
    await pm.sendEmail({
      From: process.env.POSTMARK_FROM!,
      To: process.env.TEAM_EMAIL!,
      ReplyTo: payload.contact.email,
      MessageStream: process.env.POSTMARK_STREAM ?? "outbound",
      Subject: email.subject,
      HtmlBody: email.html,
      TextBody: email.text,
      Attachments: attachments,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[configurator] postmark send failed", err);
    return NextResponse.json(
      { ok: false, code: "mailer_failed" },
      { status: 502 },
    );
  }
}
