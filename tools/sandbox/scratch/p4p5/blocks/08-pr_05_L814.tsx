export function renderWithProviders(ui: ReactElement, { api = fakeApi() }: { api?: ApiClient } = {}) {
  return render(
    <ApiClientProvider client={api}>
      <ThemeProvider>{ui}</ThemeProvider>
    </ApiClientProvider>,
  );
}
export {};
