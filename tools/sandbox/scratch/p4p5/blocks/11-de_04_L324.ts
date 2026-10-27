// invoicing/ports.ts
export interface InvoiceGateway {
  list(params: { status?: "open" | "paid" }, signal?: AbortSignal): Promise<readonly Invoice[]>;
}
export {};
