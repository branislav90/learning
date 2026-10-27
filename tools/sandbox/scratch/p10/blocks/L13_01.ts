// src/env.ts — the only file allowed to read build-tool-specific env access
interface AppEnv {
  apiBaseUrl: string;
  sentryDsn: string | undefined;
  mode: 'development' | 'production' | 'test';
}

// Vite exposes import.meta.env; CRA exposed process.env.REACT_APP_*
export const env: AppEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  mode: import.meta.env.MODE as AppEnv['mode'],
};
