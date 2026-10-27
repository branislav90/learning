// ui/AddressForm.tsx — the draft is component-owned; entity is read-only input
function AddressForm({ order }: { order: Order }) {
  const [draft, setDraft] = useState<Address>(order.address);   // seeded once per order id (parent keys by id)
  const update = useUpdateOrderAddress(order.id);
  const dirty = !addressEquals(draft, order.address);           // derived
  return (
    <form onSubmit={(e) => { e.preventDefault(); update.mutate(draft); }}>
      {/* fields bound to draft */}
      <button disabled={!dirty || update.isPending}>Save</button>
      {update.isError && <ErrorSummary error={update.error} />}
    </form>
  );
}
// parent: <AddressForm key={order.id} order={order} />
export {};
