function Checkout() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  /* … 12 more useState calls … */
  return (
    <form onSubmit={…}>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      {/* … */}
      <ExpensiveOrderSummary />        {/* re-renders on every keystroke in any field */}
    </form>
  );
}
export {};
