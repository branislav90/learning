// flags/registry.ts
export const flags = {
  'checkout.new-payment-form': { owner: 'team-checkout', created: '2025-09-01', expires: '2026-01-15', note: 'Remove after 100% rollout' },
  'cart.zustand-store':        { owner: 'team-cart',     created: '2026-02-10', expires: '2026-05-01', note: 'Migration flag; see 13' },
} as const;
export type FlagKey = keyof typeof flags;

// Using the registry key type means unknown flags are compile errors,
// and a registry entry is the single place to see owner + expiry.
