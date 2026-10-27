// packages/shared/routes/src/index.ts
export const routes = {
  home: () => '/' as const,
  product: (p: { slug: string }) => `/p/${encodeURIComponent(p.slug)}` as const,
  checkout: (p: { cartId: string; step?: 'shipping' | 'payment' }) =>
    `/checkout/${encodeURIComponent(p.cartId)}${p.step ? `?step=${p.step}` : ''}` as const,
} as const;
