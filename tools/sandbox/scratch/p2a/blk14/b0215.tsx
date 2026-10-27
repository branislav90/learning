function Configurator() {
  const [qty, setQty] = useState(1);            // hook A
  const [promo, setPromo] = useState("none");   // hook B
  const [isPending, startTransition] = useTransition();
  console.log("render", { qty, promo, isPending });
  return (
    <>
      <button onClick={() => {
        startTransition(() => setPromo("SUMMER"));    // T1 on hook B  (transition lane)
        setQty((q) => q + 1);                          // U1 on hook A  (sync lane)
      }}>add</button>
      <Breakdown qty={qty} promo={promo} />
    </>
  );
}
