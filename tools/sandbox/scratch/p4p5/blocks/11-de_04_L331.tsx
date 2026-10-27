// invoicing/GatewayContext.tsx
const GatewayContext = createContext<InvoiceGateway | null>(null);
export const GatewayProvider = ({ gateway, children }: { gateway: InvoiceGateway; children: ReactNode }) =>
  <GatewayContext value={gateway}>{children}</GatewayContext>;
export function useInvoiceGateway(): InvoiceGateway {
  const g = use(GatewayContext);
  if (!g) throw new Error("GatewayProvider missing");
  return g;
}
export {};
