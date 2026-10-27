// App owns user and creates the element once; intermediaries only place `avatar`.
function App() {
  const user = useUser();
  return <Layout sidebar={<Sidebar menu={<UserMenu avatar={<Avatar user={user} />} />} />} />;
}
function Layout({ sidebar }: { sidebar: React.ReactNode }) { return <div className="layout">{sidebar}</div>; }
function Sidebar({ menu }: { menu: React.ReactNode }) { return <aside>{menu}</aside>; }
function UserMenu({ avatar }: { avatar: React.ReactNode }) { return <nav>{avatar}</nav>; }
export {};
