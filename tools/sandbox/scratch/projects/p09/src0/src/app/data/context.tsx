// src/app/data/context.tsx
import { createContext, use } from 'react';
import type { DataCache } from './cache';
import type { Services } from '../services-types';

export interface AppData {
  cache: DataCache;
  services: Services;      // server: in-process functions; client: fetch-based implementations
  now: number;             // epoch ms captured ONCE per request (see RelativeTime)
}

const Ctx = createContext<AppData | null>(null);
export const DataProvider = Ctx;           // React 19: <Ctx value={...}> works as provider

export function useAppData(): AppData {
  const v = use(Ctx);                      // `use` can read context conditionally too
  if (!v) throw new Error('DataProvider missing');
  return v;
}
