// server/index.ts
import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { matchRoute } from '../src/app/routes';
import { loadRoute } from './loaders';
import { renderStream } from './render';

const dev = process.env.NODE_ENV !== 'production';

async function main() {
  let vite: import('vite').ViteDevServer | undefined;
  let bootstrap = ['/assets/entry-client.js'];       // prod: read from the client manifest

  if (dev) {
    const { createServer } = await import('vite');
    vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
    bootstrap = ['/@vite/client', '/src/client/entry-client.tsx'];
  } else {
    // ⚠ verify manifest path/shape for your Vite major (commonly dist/client/.vite/manifest.json)
    const manifest = JSON.parse(await (await import('node:fs/promises')).readFile('dist/client/.vite/manifest.json', 'utf8'));
    bootstrap = ['/' + manifest['src/client/entry-client.tsx'].file];
  }

  const server = http.createServer((req, res) => {
    const handle = async () => {
      const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
      if (req.method === 'POST' && /^\/products\/[a-z0-9-]+\/reviews$/.test(url.pathname)) {
        return handleReviewPost(req, res, url);     // see §7.12
      }
      const route = matchRoute(url);
      const { status, critical } = await loadRoute(route);
      renderStream({ req, res, route, status, critical, bootstrapModules: bootstrap,
                     nonce: randomBytes(16).toString('base64'), dev });
    };
    const run = () => handle().catch((e) => { console.error(e); if (!res.headersSent) { res.statusCode = 500; } res.end(); });
    if (vite) vite.middlewares(req, res, run); else servePublicOr(req, res, run);
  });
  server.listen(3000);
}
void main();
declare function handleReviewPost(...a: unknown[]): Promise<void>;
declare function servePublicOr(...a: unknown[]): void;
