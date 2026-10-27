// 1) Controlled
function Controlled() {
  const [v, setV] = useState("");
  return <input value={v} onChange={(e) => setV(e.target.value)} />;
}

// 2) Uncontrolled with ref
function UncontrolledRef() {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form onSubmit={(e) => { e.preventDefault(); console.log(ref.current?.value); }}>
      <input ref={ref} defaultValue="" />
      <button>Save</button>
    </form>
  );
}

// 3) Uncontrolled with FormData (no refs)
function UncontrolledFormData() {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      console.log(Object.fromEntries(data));        // { name: "…" }
    }}>
      <input name="name" defaultValue="" />
      <button>Save</button>
    </form>
  );
}
export {};
