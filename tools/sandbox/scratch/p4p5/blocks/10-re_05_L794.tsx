function FetchJson<T>({ url, children }: { url: string; children: (s: Resource<T>) => ReactNode }) {
  const state = useJsonResource<T>(url);
  return <>{children(state)}</>;
}
export {};
