// contexts/disputes/infrastructure/monitoring-acl.ts
import type { DisputableTransaction, TransactionId } from "../domain/disputable-transaction";
import { money, type CurrencyCode } from "../../../shared-kernel/money";

// Shape published by the Monitoring API (their language, their naming).
interface MonitoringTxDto {
  txn_id: string;
  gross_amount_minor: number;
  ccy: string;
  ts: string;                     // ISO-8601
  site: { operator_name: string };
  flags?: { dispute_deadline?: string };
}

const SUPPORTED: readonly CurrencyCode[] = ["EUR", "GBP", "PLN", "CZK"];

function isCurrency(c: string): c is CurrencyCode {
  return (SUPPORTED as readonly string[]).includes(c);
}

export function toDisputable(dto: MonitoringTxDto): DisputableTransaction {
  if (!isCurrency(dto.ccy)) throw new Error(`Unsupported currency: ${dto.ccy}`);
  const occurredAt = new Date(dto.ts);
  const deadline = dto.flags?.dispute_deadline
    ? new Date(dto.flags.dispute_deadline)
    : new Date(occurredAt.getTime() + 90 * 24 * 3600 * 1000); // fallback: assumption documented here, not scattered
  return {
    id: dto.txn_id as TransactionId,
    amount: money(dto.gross_amount_minor, dto.ccy),
    occurredAt,
    merchantName: dto.site.operator_name,
    disputeWindowEndsAt: deadline,
  };
}
export {};
