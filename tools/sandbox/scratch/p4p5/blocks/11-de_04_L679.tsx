export function renderWithServices(ui: ReactElement, overrides: Partial<Services> = {}) {
  const track = vi.fn();
  const services: Services = {
    clock: { now: () => new Date("2025-01-01T00:00:00Z") },
    analytics: { track },
    ...overrides,
  };
  return { track, ...render(<ServicesProvider value={services}>{ui}</ServicesProvider>) };
}
export {};
