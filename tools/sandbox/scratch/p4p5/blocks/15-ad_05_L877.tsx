import { createContext, use, type ReactNode } from 'react';

export function createStrictContext<T>(name: string) {
  const Ctx = createContext<T | undefined>(undefined);
  Ctx.displayName = name;

  function Provider({ value, children }: { value: T; children: ReactNode }) {
    return <Ctx value={value}>{children}</Ctx>;
  }
  function useValue(): T {
    const v = use(Ctx);
    if (v === undefined) throw new Error(`use${name} must be used inside <${name}Provider>`);
    return v;
  }
  return [Provider, useValue] as const;
}
export {};
