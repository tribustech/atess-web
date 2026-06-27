import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

// GitHub OAuth relay for Sveltia CMS (step 1 of 2).
// Sveltia opens this in a popup; we bounce the editor to GitHub's consent
// screen. GitHub then calls /api/auth/callback. See config.yml (backend) and
// docs/plans/2026-06-23-teo-cms-design.md.

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";

function baseUrl(req: Request): string {
  const env = process.env.CMS_OAUTH_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET(req: Request) {
  const clientId = process.env.CMS_GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "CMS OAuth is not configured (missing CMS_GITHUB_CLIENT_ID)." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  // Sveltia/Decap pass the requested scope; default to repo write access.
  const scope = searchParams.get("scope") || "repo";
  const state = randomBytes(16).toString("hex");

  const authUrl = new URL(GITHUB_AUTHORIZE);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", `${baseUrl(req)}/api/auth/callback`);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authUrl.toString());
  // CSRF guard: round-trip the state through an httpOnly cookie.
  res.cookies.set("cms_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 600,
  });
  return res;
}
