// server.tsx (Node, Express-like; ⚠ simplified: no error handling, no streaming)
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import { App } from './App';
import { getOrders } from './db';

app.get('/orders', async (req, res) => {
  const user = await requireUser(req);                    // auth on the server
  const orders = await getOrders(user.id);                // data loading BEFORE render
  const html = renderToString(<App initialOrders={orders} />);
  res.setHeader('Cache-Control', 'private, no-store');    // user-specific
  res.send(`<!doctype html>
<html><body>
<div id="root">${html}</div>
<script>window.__INITIAL__ = ${serialize({ orders }, { isJSON: true })};</script>
<script type="module" src="/client.js"></script>
</body></html>`);
});
export {};
