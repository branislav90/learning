function createField(kind: 'text' | 'number') {
  return function Field({ name }: { name: string }) {
    const [value, setValue] = useState('');
    return <input name={name} type={kind} value={value} onChange={(e) => setValue(e.target.value)} />;
  };
}

function Form({ kind }: { kind: 'text' | 'number' }) {
  const [submitCount, setSubmitCount] = useState(0);
  const Field = createField(kind);            // new function every render of Form
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitCount((c) => c + 1); }}>
      <Field name="qty" />
      <button>Submit ({submitCount})</button>
    </form>
  );
}
export {};
