// (1) State colocation: move the state down so Page does not re-run.
function Page() {
  return (
    <>
      <Header title="Shop" />
      <PanelToggle />   {/* owns `open` */}
    </>
  );
}

// (2) Pass the stable subtree as children (the elements are created by the parent that does not re-run).
function Toggler({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {children}
      <button onClick={() => setOpen(!open)}>Toggle</button>
      {open && <Panel />}
    </>
  );
}
// <Toggler><Header title="Shop" /></Toggler>

// (3) Opt in to value comparison.
const Header = memo(function Header({ title }: { title: string }) {
  return <h1>{title}</h1>;
});
