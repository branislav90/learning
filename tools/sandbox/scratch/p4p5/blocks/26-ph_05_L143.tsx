function Layout({ children }: { children: React.ReactNode }) {
  const kids = Children.toArray(children) as React.ReactElement[];
  const header = kids.find((k) => k.type === Layout.Header);
  const rest = kids.filter((k) => k !== header);
  return <div><header>{header}</header><main>{rest}</main></div>;
}
Layout.Header = ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>;

function AppHeader() { return <Layout.Header>Hi</Layout.Header>; }

<Layout><AppHeader /><p>Body</p></Layout>
export {};
