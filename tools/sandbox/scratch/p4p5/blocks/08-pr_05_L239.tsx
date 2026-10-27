const httpClient: ApiClient = createHttpClient({ baseUrl: import.meta.env.VITE_API_URL });

createRoot(document.getElementById("root")!).render(
  <ApiClientProvider client={httpClient}>
    <App />
  </ApiClientProvider>,
);
export {};
