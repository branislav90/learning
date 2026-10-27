// modules/invoicing/domain/invoice.ts
export type InvoiceId = string & { readonly __brand: 'InvoiceId' }
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'void'

export interface LineItem { id: string; description: string; quantityMilli: number; unitPriceCents: number; taxRateBp: number }
export interface Invoice { id: InvoiceId; customerId: string; status: InvoiceStatus; lines: LineItem[]; currency: 'EUR' | 'USD'; issuedAt?: string }

import { ok, err, type Result } from './result'
// modules/invoicing/domain/transitions.ts
const ALLOWED: Record<InvoiceStatus, readonly InvoiceStatus[]> = {
  draft: ['sent', 'void'],
  sent: ['paid', 'void'],
  paid: [],
  void: [],
}
export const canTransition = (from: InvoiceStatus, to: InvoiceStatus) => ALLOWED[from].includes(to)
export const isEditable = (s: InvoiceStatus) => s === 'draft'

export function transition(inv: Invoice, to: InvoiceStatus, now: Date): Result<Invoice, 'illegal_transition' | 'empty_invoice'> {
  if (!canTransition(inv.status, to)) return err('illegal_transition')
  if (to === 'sent' && inv.lines.length === 0) return err('empty_invoice')
  return ok({ ...inv, status: to, issuedAt: to === 'sent' ? now.toISOString() : inv.issuedAt })
}
