// Own vocabulary for feature flags; vendor hook hidden.
import { useVendorFlag } from 'flags-sdk'; // hypothetical: returns {value, isLoading, err}

export type FlagState = { status: 'loading' } | { status: 'ready'; enabled: boolean };

export function useFlag(name: string): FlagState {
  const r = useVendorFlag(name);
  if (r.isLoading) return { status: 'loading' };
  return { status: 'ready', enabled: r.err ? false : Boolean(r.value) };
}
export {};
