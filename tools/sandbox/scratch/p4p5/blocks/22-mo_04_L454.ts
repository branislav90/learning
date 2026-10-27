import { money, type Money } from "@acme/domain-money";
import type { HttpClient } from "../http";

interface CardDto { id: string; masked_pan: string; limit_minor: number; currency: "EUR" | "GBP" | "PLN" | "CZK" }
export interface Card { id: string; maskedPan: string; limit: Money }

const toCard = (d: CardDto): Card => ({ id: d.id, maskedPan: d.masked_pan, limit: money(d.limit_minor, d.currency) });

export function createCardsApi(http: HttpClient) {
  return {
    list: async (): Promise<Card[]> => (await http<CardDto[]>("/cards")).map(toCard),
    get: async (id: string): Promise<Card> => toCard(await http<CardDto>(`/cards/${encodeURIComponent(id)}`)),
  };
}
export type CardsApi = ReturnType<typeof createCardsApi>;
export {};
