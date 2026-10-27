// shared/testing/renderWithProviders.tsx
export function renderModule(ui: ReactElement, opts: { adapters?: Record<string, unknown>; permissions?: PermissionKey[]; flags?: Record<string, boolean>; route?: string } = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const adapters = new Map(Object.entries(opts.adapters ?? {}))
  return render(
    <QueryClientProvider client={client}>
      <AdapterProvider adapters={adapters}>
        <TestSession permissions={opts.permissions ?? []}>
          <TestFlags flags={opts.flags ?? {}}>
            <MemoryRouter initialEntries={[opts.route ?? '/']}>{ui}</MemoryRouter>
          </TestFlags>
        </TestSession>
      </AdapterProvider>
    </QueryClientProvider>,
  )
}
