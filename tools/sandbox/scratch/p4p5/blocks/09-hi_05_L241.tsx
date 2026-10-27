export function withRequiredRole<P extends object>(role: "admin" | "editor") {
  return function decorate(Component: ComponentType<P>) {
    function WithRequiredRole(props: P) {
      const session = useSession(); // custom hook: { status, user }
      if (session.status === "loading") return <FullPageSpinner />;
      if (session.status === "anonymous") return <Navigate to="/login" replace />;
      if (!session.user.roles.includes(role)) return <Forbidden />;
      return <Component {...props} />;
    }
    WithRequiredRole.displayName = `WithRequiredRole(${role})(${Component.displayName ?? Component.name})`;
    return WithRequiredRole;
  };
}

export const AdminReports = withRequiredRole("admin")(ReportsPage);
export {};
