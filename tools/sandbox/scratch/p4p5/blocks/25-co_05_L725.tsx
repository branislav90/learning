type Notification = { id: string; type: string; payload: any; read: boolean };

function icon(n: Notification) {
  if (n.type === "email") return "✉";
  if (n.type === "mention") return "@";
  if (n.type === "billing") return "$";
  return "?";
}

function Row({ n }: { n: Notification }) {
  let body: React.ReactNode = null;
  if (n.type === "email") body = <span>{n.payload.from} sent: {n.payload.subject}</span>;
  else if (n.type === "mention") body = <span>{n.payload.by} mentioned you in {n.payload.room}</span>;
  else if (n.type === "billing") body = <span>Invoice {n.payload.invoiceId} {n.payload.status}</span>;
  return <li>{icon(n)} {body}</li>;
}
export {};
