// features/auth/requireSession.ts (conceptual loader)
export async function requireSession({ request }: LoaderArgs) {
  const session = await sessionQuery.ensure();           // from server (cookie-based) — source of truth is the server
  if (!session) {
    const url = new URL(request.url);
    throw redirect(`/login?next=${encodeURIComponent(url.pathname + url.search)}`);
  }
  return null;
}
export {};
