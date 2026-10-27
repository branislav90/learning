// .env.production
VITE_STRIPE_SECRET_KEY=sk_live_...        // ❌ secret exposed publicly
VITE_API_URL=https://api.example.com

// src/api.ts
export const api = import.meta.env.VITE_API_URL;   // baked in
if (import.meta.env.VITE_ENV === "staging") {      // staging bundle != production bundle
  enableDebugPanel();
}
