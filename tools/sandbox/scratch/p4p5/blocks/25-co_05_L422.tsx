const withAuth = <P extends object>(C: React.ComponentType<P & { user: User }>) =>
  function WithAuth(props: P) {
    const user = useCurrentUser();            // hook used inside a HOC wrapper, fine
    useEffect(() => { if (!user) window.location.assign("/login"); }, [user]);
    return <C {...props} user={user as User} />;   // cast hides the null case
  };

const withTheme = <P extends object>(C: React.ComponentType<P & { theme: Theme }>) =>
  (props: P) => <C {...props} theme={useTheme()} />;   // ❌ hook called in an arrow that isn't a component by name; works but lint-hostile

const withAnalytics = <P extends object>(C: React.ComponentType<P>) =>
  (props: P) => { useEffect(() => track("view"), []); return <C {...props} />; };

function DashboardBase({ user, theme }: { user: User; theme: Theme }) { /* … */ }
export const Dashboard = withAuth(withTheme(withAnalytics(DashboardBase)));
export {};
