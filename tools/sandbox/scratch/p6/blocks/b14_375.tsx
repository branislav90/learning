// (1) loader/server-side prefetch + hydrated cache (5.2), or loader data passed as props (5.1)
// (2) per-request client (5.2: cache() + isServer branch)
// (3) queryKey: ['orders', userId, 'list']
// (4) use a serialiser that escapes (5.1) or the library/framework's built-in mechanism
// (5) const [user, prefs, orders] = await Promise.all([getUser(id), getPrefs(id), getOrders(id)]);
// (6) pass only public fields:
const publicConfig = { apiBase: process.env.NEXT_PUBLIC_API_BASE };  // names with public prefixes only
export {};
