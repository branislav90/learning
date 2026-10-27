export function withLogging<S, A>(reducer: (s: S, a: A) => S, label: string) {
  return (s: S, a: A): S => {
    const next = reducer(s, a);
    if (import.meta.env.DEV) console.log(`[${label}]`, a, s, "→", next);   // Vite-style flag; ⚠ differs per bundler
    return next;
  };
}
export {};
