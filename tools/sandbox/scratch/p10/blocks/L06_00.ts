// server.ts (conceptual; framework APIs differ — verify for yours)
import { randomBytes } from "node:crypto";

export function handleRequest(req: Request): Response {
  const nonce = randomBytes(16).toString("base64");          // fresh per response, unguessable

  const csp = [
    `script-src 'nonce-${nonce}' 'strict-dynamic'`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
  ].join("; ");

  const html = renderToHtml({ nonce });   // your SSR render: pass nonce to <script nonce={nonce}> tags
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": csp },
  });
}
