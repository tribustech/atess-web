import { randomBytes } from "node:crypto";

// GitHub OAuth relay for Sveltia CMS (step 2 of 2).
// GitHub redirects here with ?code; we exchange it for an access token and hand
// it back to the CMS window via the Decap-compatible postMessage handshake.

const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

// HTML page that completes the popup handshake: it tells the opener it is
// authorizing, waits for the opener's acknowledgement (to learn its origin),
// then posts the result back to that exact origin.
function handshakeHtml(status: "success" | "error", payload: unknown): string {
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(payload)}`);
  const nonce = randomBytes(8).toString("hex");
  return `<!doctype html><html><head><meta charset="utf-8" /><title>Autentificare…</title></head>
<body>
<p>Se finalizează autentificarea…</p>
<script nonce="${nonce}">
(function () {
  var message = ${message};
  function receive(e) {
    if (!e || !e.origin) return;
    window.opener.postMessage(message, e.origin);
    window.removeEventListener("message", receive, false);
  }
  window.addEventListener("message", receive, false);
  if (window.opener) {
    window.opener.postMessage("authorizing:github", "*");
  } else {
    document.body.innerText = "Deschideți această pagină din panoul de administrare.";
  }
})();
</script>
</body></html>`;
}

function htmlResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      // One-time cookie, clear it.
      "Set-Cookie": "cms_oauth_state=; Path=/api/auth; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
    },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieState = readCookie(req, "cms_oauth_state");

  if (!code) {
    return htmlResponse(handshakeHtml("error", { error: "Cod de autorizare lipsă." }), 400);
  }
  if (!state || !cookieState || state !== cookieState) {
    return htmlResponse(handshakeHtml("error", { error: "Stare OAuth invalidă." }), 400);
  }

  const clientId = process.env.CMS_GITHUB_CLIENT_ID;
  const clientSecret = process.env.CMS_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return htmlResponse(handshakeHtml("error", { error: "OAuth neconfigurat pe server." }), 500);
  }

  try {
    const tokenRes = await fetch(GITHUB_TOKEN, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };
    if (!data.access_token) {
      return htmlResponse(
        handshakeHtml("error", { error: data.error_description || data.error || "Schimb de token eșuat." }),
        502,
      );
    }
    return htmlResponse(handshakeHtml("success", { token: data.access_token, provider: "github" }));
  } catch {
    return htmlResponse(handshakeHtml("error", { error: "Nu s-a putut contacta GitHub." }), 502);
  }
}
