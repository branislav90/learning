export function isOverdue(inv: Invoice) {
  return new Date(inv.dueDate) < new Date() && inv.status !== "PAID";
}
export {};
