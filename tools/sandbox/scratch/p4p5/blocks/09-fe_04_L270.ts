// entities/transaction/api/get-transactions.ts
import { httpClient } from "@/shared/api";
import type { Transaction } from "../model/types";

export async function getTransactions(params: { from: string; to: string }, signal?: AbortSignal): Promise<Transaction[]> {
  const res = await httpClient.get<Transaction[]>("/transactions", { params, signal });
  return res.data;
}
export {};
