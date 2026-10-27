// src/shared/flags/useFlag.ts
import { use, createContext } from "react";

export type Flags = Readonly<Record<string, boolean>>;
export const FlagsContext = createContext<Flags>({});

export function useFlag(name: string, fallback = false): boolean {
  const flags = use(FlagsContext);
  return flags[name] ?? fallback;   // explicit fallback = behavior when flag service is down
}
