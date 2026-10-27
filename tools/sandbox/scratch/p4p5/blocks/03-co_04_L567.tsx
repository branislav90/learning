function Form() {
  const [name, setName] = useState("");
  const Field = () => <input value={name} onChange={(e) => setName(e.target.value)} />;
  return <Field />;
}
export {};
