function NotificationBody({ n }: { n: Notification }): React.ReactNode {
  switch (n.type) {
    case "email":   return <>{n.from} sent: {n.subject}</>;
    case "mention": return <>{n.by} mentioned you in {n.room}</>;
    case "billing": return <>Invoice {n.invoiceId} {n.status}</>;
    default:        return assertNever(n);
  }
}

const ICONS = { email: "✉", mention: "@", billing: "$" } as const satisfies Record<Notification["type"], string>;

function Row({ n }: { n: Notification }) {
  return <li data-read={n.read}>{ICONS[n.type]} <NotificationBody n={n} /></li>;
}
export {};
