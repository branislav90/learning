// entities/transaction/api/keys.ts
export const transactionKeys = {
  all: ["transactions"] as const,
  list: (p: { from: string; to: string }) => [...transactionKeys.all, p] as const,
};
export {};
