// entities/transaction/index.ts   ← public API
export type { Transaction, TransactionId } from "./model/types";
export { getTransactions } from "./api/get-transactions";
export { TransactionRow } from "./ui/TransactionRow";
export {};
