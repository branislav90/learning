function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(() => ({ width: window.innerWidth, height: window.innerHeight }));
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const session = useSession();
  if (session.status === "loading") return <FullPageSpinner />;
  if (session.status === "anonymous") return <Navigate to="/login" replace />;
  if (!session.user.roles.includes(role)) return <Forbidden />;
  return <>{children}</>;
}

function DashboardBase({ reportId }: { reportId: string }) {
  const size = useWindowSize();          // behaviour: where it is used, visible in the file
  return <Chart reportId={reportId} width={size.width / 2} />;
}

// Composition at the call site (e.g. in a route definition)
<ErrorBoundary fallback={<CrashPage />}>
  <RequireRole role="admin">
    <DashboardBase reportId="7" />
  </RequireRole>
</ErrorBoundary>
export {};
