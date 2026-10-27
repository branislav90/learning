// invoicing/use-invoices.ts
export function useInvoices(status?: "open" | "paid") {
  const gateway = useInvoiceGateway();
  return useQuery({
    queryKey: ["invoices", { status }],
    queryFn: ({ signal }) => gateway.list({ status }, signal),
  });
}
export {};
