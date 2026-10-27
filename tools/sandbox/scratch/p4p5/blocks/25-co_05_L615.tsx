function SignUp() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAccount(email);
      setSuccess(true);
      setMessage("Welcome!");
    } catch (err) {
      setError(true);
      setMessage(String(err));
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={isSubmitting}>Create</button>
      {isSuccess && <p>{message}</p>}
      {isError && <p role="alert">{message}</p>}
    </form>
  );
}
export {};
