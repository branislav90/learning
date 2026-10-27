function withOverrides(parent: Services, overrides: Partial<Services>): Services {
  return { ...parent, ...overrides };
}

function QuarterReport() {
  const parent = useServices();
  // Stable identity: only recompute when `parent` changes.
  const frozen = useMemo(
    () => withOverrides(parent, { clock: { now: () => Date.UTC(2025, 0, 1) } }),
    [parent],
  );
  return (
    <ServicesProvider services={frozen}>
      <OrderHistory />
    </ServicesProvider>
  );
}
export {};
