export {};
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

function statusLabel(s: string): string {
  switch (s as OrderStatus) {
    case 'pending': return 'Pending';
    case 'paid': return 'Paid';
    case 'shipped': return 'Shipped';
    case 'cancelled': return 'Cancelled';
    default: return 'Processing'; // server added 'refunded' last week — do not crash
  }
}
