// server.tsx (illustrative; framework-specific wiring differs)
export async function renderPage(req: Request) {
  const services = createServerServices({
    // cookies/headers come from *this* request
    http: createHttp({ baseUrl: process.env.API_URL!, headers: { cookie: req.headers.get('cookie') ?? '' } }),
    clock: { now: () => Date.now() },
    // ...
  });
  return renderToString(
    <ServicesProvider services={services}><App /></ServicesProvider>,
  );
}
export {};
