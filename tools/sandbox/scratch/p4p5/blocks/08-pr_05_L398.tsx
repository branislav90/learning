import { createContext, useContext, type Context, type ReactNode } from "react";

export function createStrictContext<T>(name: string) {
  const Ctx: Context<T | undefined> = createContext<T | undefined>(undefined);
  Ctx.displayName = name;

  function useStrict(): T {
    const value = useContext(Ctx);
    if (value === undefined) {
      throw new Error(`use${name} must be used inside <${name}Provider>`);
    }
    return value;
  }

  function Provider({ value, children }: { value: T; children: ReactNode }) {
    return <Ctx value={value}>{children}</Ctx>;
  }
  Provider.displayName = `${name}Provider`;

  return [Provider, useStrict] as const;
}

// usage
export const [FlagsProvider, useFlags] = createStrictContext<FlagClient>("Flags");
export {};
