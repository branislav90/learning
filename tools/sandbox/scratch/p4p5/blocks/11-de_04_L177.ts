// invoice-rules.ts (pure; no React)
export interface Invoice { readonly id: string; readonly dueDate: Date; readonly paid: boolean }

export function isOverdue(invoice: Invoice, now: Date): boolean {
  return !invoice.paid && now.getTime() > invoice.dueDate.getTime();
}
export {};
