// server/render.tsx
import type { IncomingMessage, ServerResponse } from 'node:http';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { App } from '../src/app/App';
import { createMapCache, fulfilled } from '../src/app/data/cache';
import { dataScript } from '../src/app/data/serialize';
import { createServices } from './services';
import type { Route } from '../src/app/routes';

const BOT = /bot|crawler|spider|googlebot|bingbot|duckduckbot|slurp|facebookexternalhit|linkedinbot/i;
const ABORT_AFTER_MS = 10_000;

export interface RenderInput {
  req: IncomingMessage; res: ServerResponse;
  route: Route; status: number; critical: Record<string, unknown>;
  bootstrapModules: string[]; nonce: string; dev: boolean;
}

export function renderStream(input: RenderInput): void {
  const { req, res, route, status, critical, bootstrapModules, nonce, dev } = input;
  const isBot = BOT.test(req.headers['user-agent'] ?? '');
  const now = Date.now();

  const out = new PassThrough();               // single funnel: React output AND our data scripts
  let shellFlushed = false;
  const queued: string[] = [];
  const emitted = new Set<string>();

  const cache = createMapCache((key, value) => {
    if (emitted.has(key)) return;
    emitted.add(key);
    const script = dataScript(key, value, nonce);
    if (shellFlushed) out.write(script); else queued.push(script);
  });

  // Critical data goes into the cache already-fulfilled so components `use()` it synchronously.
  // They are embedded by <Document> (part of the shell), so mark them emitted: never streamed twice.
  for (const [k, v] of Object.entries(critical)) {
    cache.entries.set(k, fulfilled(v));
    emitted.add(k);
  }

  let didError = false;
  const { pipe, abort } = renderToPipeableStream(
    <App route={route} data={{ cache, services: createServices(), now }} now={now} nonce={nonce} devPreamble={dev} critical={critical} />,
    {
      nonce,
      bootstrapModules,
      onShellReady() {
        if (isBot) return;                      // bots wait for onAllReady
        start();
      },
      onAllReady() {
        if (isBot) start();
      },
      onShellError(err) {
        console.error('shell error', err);
        res.statusCode = 500;
        res.setHeader('content-type', 'text/html; charset=utf-8');
        res.end('<!doctype html><title>Error</title><h1>Something went wrong</h1>');
      },
      onError(err) {
        didError = true;                        // boundary-level failure; response still streams
        console.error('render error', err);
      },
    },
  );

  function start() {
    res.statusCode = status;                    // 404 decided BEFORE render; boundary errors keep 200
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('content-security-policy', `script-src 'nonce-${nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'none'`);
    pipe(out);
    out.pipe(res);
    shellFlushed = true;
    for (const s of queued.splice(0)) out.write(s);
  }

  res.on('close', () => abort());               // client went away: stop rendering
  const timer = setTimeout(() => abort(), ABORT_AFTER_MS);
  res.on('finish', () => clearTimeout(timer));
  void didError;
}
