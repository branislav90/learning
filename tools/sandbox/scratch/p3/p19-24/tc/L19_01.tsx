export {};
function InvoiceEditor({ invoiceId }: { invoiceId: string }) {
  const { data } = useInvoice(invoiceId); // cached server state (hypothetical hook)
  const [invoice, setInvoice] = useState(data); // 🔴 copy

  return (
    <input
      value={invoice?.customer ?? ''}
      onChange={(e) => setInvoice({ ...invoice!, customer: e.target.value })}
    />
  );
}
