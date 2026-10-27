export {};
const KNOWN_STATUSES = ['pending', 'paid', 'shipped', 'cancelled'] as const;
type KnownStatus = (typeof KNOWN_STATUSES)[number];
type Status = KnownStatus | { unknown: string };

function parseStatus(s: string): Status {
  return (KNOWN_STATUSES as readonly string[]).includes(s)
    ? (s as KnownStatus)
    : { unknown: s };
}

function label(s: Status): string {
  if (typeof s === 'string') {
    switch (s) {
      case 'pending': return 'Pending';
      case 'paid': return 'Paid';
      case 'shipped': return 'Shipped';
      case 'cancelled': return 'Cancelled';
    }
  }
  return 'Processing'; // unknown future status
}
