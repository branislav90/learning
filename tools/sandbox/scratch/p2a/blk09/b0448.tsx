function Page() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Header title="Shop" />                     {/* looks unchanged... */}
      <button onClick={() => setOpen(!open)}>Toggle</button>
      {open && <Panel />}
    </>
  );
}
function Header({ title }: { title: string }) {
  console.log("Header render");                   // fires on every toggle
  return <h1>{title}</h1>;
}
