function RequireUser({ children }: { children: (user: User) => React.ReactNode }) {
  const user = useCurrentUser();           // returns User | null | "loading" in a real app
  if (user === "loading") return <Spinner />;
  if (user === null) return <Navigate to="/login" replace />;   // router-provided redirect
  return <>{children(user)}</>;
}

// route
<Route path="/dashboard" element={<RequireUser>{(user) => <Dashboard user={user} />}</RequireUser>} />

function Dashboard({ user }: { user: User }) {
  const theme = useTheme();
  usePageView("dashboard");
  return /* … */;
}
export {};
