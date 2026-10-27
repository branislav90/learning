// ❌ Fragile slot extraction
function Layout({ children }: { children: ReactNode }) {
  const all = Children.toArray(children) as ReactElement[];
  const header = all.find((c) => c.type === Layout.Header);
  const footer = all.find((c) => c.type === Layout.Footer);
  const rest = all.filter((c) => c !== header && c !== footer);
  return (
    <div>
      <header>{header}</header>
      <main>{rest}</main>
      <footer>{footer}</footer>
    </div>
  );
}
export {};
