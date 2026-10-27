// src/config.ts — typed accessor over runtime config
interface AppConfig { apiBaseUrl: string; flagsEndpoint: string; release: string }
declare global { interface Window { __APP_CONFIG__?: Partial<AppConfig> } }

export const config: AppConfig = {
  apiBaseUrl: window.__APP_CONFIG__?.apiBaseUrl ?? '',
  flagsEndpoint: window.__APP_CONFIG__?.flagsEndpoint ?? '',
  release: window.__APP_CONFIG__?.release ?? 'dev',
};
if (!config.apiBaseUrl && import.meta.env.PROD) {
  throw new Error('Missing runtime config: apiBaseUrl');   // fail loudly at startup, not on first API call
}
