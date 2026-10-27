// order.ts
import { array, idString, isoInstant, minorUnits, nullableStr, object, str, ParseError } from './parse';

export interface Money { readonly minor: number; readonly currency: string }   // ISO 4217 code

export type OrderStatus =
  | 'pending' | 'paid' | 'shipped' | 'cancelled'
  | { readonly kind: 'unknown'; readonly raw: string };

export interface OrderLine { sku: string; quantity: number; unitPrice: Money }
export interface Customer { id: string; name: string; email?: string }
export interface Order {
  id: string;
  status: OrderStatus;
  placedAt: number;            // epoch ms (instant)
  total: Money;
  customerId: string;
  lines: OrderLine[];
}

const KNOWN: readonly string[] = ['pending', 'paid', 'shipped', 'cancelled'];

function parseStatus(v: unknown, p: string): OrderStatus {
  const s = str(v, p);
  return KNOWN.includes(s) ? (s as Exclude<OrderStatus, { kind: 'unknown' }>) : { kind: 'unknown', raw: s };
}

function parseQuantity(v: unknown, p: string): number {
  const n = typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isSafeInteger(n) || n < 0) throw new ParseError(p, 'non-negative integer', v);
  return n;
}

function parseCurrency(v: unknown, p: string): string {
  const s = str(v, p);
  if (!/^[A-Z]{3}$/.test(s)) throw new ParseError(p, 'ISO 4217 currency code', v);
  return s;
}

export function parseCustomer(raw: unknown, path = 'customer'): Customer {
  const o = object(raw, path);
  return {
    id: idString(o.id, `${path}.id`),
    name: str(o.full_name, `${path}.full_name`),
    email: nullableStr(o.email, `${path}.email`),
  };
}

export function parseOrderResponse(raw: unknown): { order: Order; customer: Customer } {
  const o = object(raw, 'order');
  const currency = parseCurrency(o.currency, 'order.currency');
  const customer = parseCustomer(o.customer);
  const lines = array<OrderLine>((l, p) => {
    const lo = object(l, p);
    return {
      sku: str(lo.sku, `${p}.sku`),
      quantity: parseQuantity(lo.qty, `${p}.qty`),
      unitPrice: { minor: minorUnits(lo.unit_price, `${p}.unit_price`), currency },
    };
  })(o.lines, 'order.lines');

  const total: Money = { minor: minorUnits(o.total, 'order.total'), currency };
  const computed = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice.minor, 0);
  if (computed !== total.minor) {
    // Policy decision: report, don't reject — the server total is authoritative for payment.
    reportContractDrift({ endpoint: 'orders/:id', detail: `line sum ${computed} != total ${total.minor}` });
  }

  return {
    order: {
      id: idString(o.id, 'order.id'),
      status: parseStatus(o.status, 'order.status'),
      placedAt: isoInstant(o.created_at, 'order.created_at'),
      total,
      customerId: customer.id,
      lines,
    },
    customer,
  };
}

declare function reportContractDrift(info: { endpoint: string; detail: string }): void;
export {};
