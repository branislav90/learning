// entities/transaction/model/types.ts
export type TransactionId = string & { readonly __brand: "TransactionId" };

export interface Transaction {
  readonly id: TransactionId;
  readonly amountMinor: number;
  readonly currency: "EUR" | "GBP" | "PLN";
  readonly occurredAt: string;      // ISO
  readonly merchantName: string;
  readonly status: "pending" | "settled" | "disputed";
}
export {};
