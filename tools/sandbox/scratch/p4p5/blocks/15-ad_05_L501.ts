// payments/factory.ts — FACTORY: config -> gateway; STRATEGY selection by country
type GatewayFactory = () => PaymentGateway;

const gatewayFactories = {
  acme: () => acmeAdapter(getAcmeClient()),
  bankly: () => banklyAdapter(getBanklyClient()),
  wallet: () => walletAdapter(window.walletSdk),
} satisfies Record<string, GatewayFactory>;

type GatewayId = keyof typeof gatewayFactories;

const gatewayByCountry: Record<string, GatewayId> = { GB: 'acme', DE: 'bankly', NL: 'bankly' };

export function chooseGatewayId(country: string): GatewayId {
  return gatewayByCountry[country] ?? 'acme';
}

const cache = new Map<GatewayId, PaymentGateway>();
export function getGateway(id: GatewayId): PaymentGateway {
  let g = cache.get(id);
  if (!g) { g = gatewayFactories[id](); cache.set(id, g); }
  return g;
}
export {};
