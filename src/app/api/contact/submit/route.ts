import { NextResponse } from "next/server";
import { z } from "zod";
import { getConfiguratorEnvStatus } from "@/lib/configurator-env";
import { getPostmark } from "@/lib/postmark";
import { buildContactEmail } from "@/lib/email-templates/contact-message";
import { checkRateLimit } from "./rate-limit";

const PayloadSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^(\+4)?0[2-7][0-9]{8}$/)
    .optional()
    .or(z.literal("")),
  subject: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(10).max(4000),
  source: z.string().max(80).optional(),
  website: z.string().optional(), // honeypot
});

function getIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

export async function POST(req: Request) {
  const env = getConfiguratorEnvStatus();
  if (!env.ok) {
    console.warn("[contact] missing env vars:", env.missing.join(", "));
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json" },
      { status: 400 },
    );
  }

  let payload: z.infer<typeof PayloadSchema>;
  try {
    payload = PayloadSchema.parse(body);
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

  if (payload.website && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = getIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, code: "rate_limited" },
      { status: 429 },
    );
  }

  const email = buildContactEmail({
    name: payload.name,
    email: payload.email,
    phone: payload.phone || undefined,
    subject: payload.subject || undefined,
    message: payload.message,
    source: payload.source,
  });

  try {
    const pm = getPostmark();
    await pm.sendEmail({
      From: process.env.POSTMARK_FROM!,
      To: process.env.TEAM_EMAIL!,
      ReplyTo: payload.email,
      MessageStream: process.env.POSTMARK_STREAM ?? "outbound",
      Subject: email.subject,
      HtmlBody: email.html,
      TextBody: email.text,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] postmark send failed", err);
    return NextResponse.json(
      { ok: false, code: "mailer_failed" },
      { status: 502 },
    );
  }
}
