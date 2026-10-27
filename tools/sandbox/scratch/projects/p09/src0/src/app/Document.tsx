// src/app/Document.tsx
import type { ReactNode } from 'react';
import { serializeForScript } from './data/serialize';

export function Document({ children, now, nonce, devPreamble, critical }: {
  children: ReactNode; now: number; nonce?: string; devPreamble?: boolean; critical?: Record<string, unknown>;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* precedence => React dedupes, orders, and (during SSR) blocks reveal until loaded */}
        <link rel="stylesheet" href="/assets/app.css" precedence="default" />
        {devPreamble && (
          <script type="module" nonce={nonce} dangerouslySetInnerHTML={{ __html: `
            import RefreshRuntime from "/@react-refresh";
            RefreshRuntime.injectIntoGlobalHook(window);
            window.$RefreshReg$ = () => {};
            window.$RefreshSig$ = () => (type) => type;
            window.__vite_plugin_react_preamble_installed__ = true;` }} />
        )}
      </head>
      <body>
        {children}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `self.__NOW__=${Math.trunc(now)}` }} />
        {critical && Object.entries(critical).map(([k, v]) => (
          <script key={k} nonce={nonce} dangerouslySetInnerHTML={{ __html: `(self.__DATA__=self.__DATA__||[]).push([${serializeForScript(k)},${serializeForScript(v)}])` }} />
        ))}
      </body>
    </html>
  );
}
