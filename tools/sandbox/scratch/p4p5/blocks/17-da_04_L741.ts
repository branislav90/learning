export function withCommandLog<T extends Record<string, (...a: any[]) => any>>(name: string, commands: T): T {
  if (import.meta.env.PROD) return commands;     // ⚠ env var syntax is bundler-specific (Vite shown)
  return Object.fromEntries(
    Object.entries(commands).map(([k, fn]) => [
      k,
      (...args: unknown[]) => { console.debug(`[cmd] ${name}.${k}`, args); return fn(...args); },
    ]),
  ) as T;
}
export {};
