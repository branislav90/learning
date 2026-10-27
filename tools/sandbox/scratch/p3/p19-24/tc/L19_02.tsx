export {};
function InvoiceEditorShell({ invoiceId }: { invoiceId: string }) {
  const { data, isPending } = useInvoice(invoiceId);
  if (isPending || !data) return <Skeleton />;
  // key resets the draft when the identity of the thing being edited changes
  return <InvoiceEditor key={invoiceId} initial={data} />;
}

function InvoiceEditor({ initial }: { initial: Invoice }) {
  const [draft, setDraft] = useState<Invoice>(initial); // a *draft*, intentionally a copy
  const dirty = draft.customer !== initial.customer; // derived, not stored
  // ...
}
