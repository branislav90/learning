function Checkout() {
  const [country, setCountry] = useState("DE");      // controlled: drives other UI (tax, shipping options)
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    submit({ ...data, country });
  }
  return (
    <form onSubmit={onSubmit}>
      <input name="firstName" defaultValue="" autoComplete="given-name" required />
      <input name="lastName" defaultValue="" autoComplete="family-name" required />
      <input name="email" type="email" defaultValue="" autoComplete="email" required />
      <CountrySelect value={country} onChange={setCountry} />
      <ExpensiveOrderSummary country={country} />   {/* re-renders only when country changes */}
      <button>Place order</button>
    </form>
  );
}
export {};
