import { createContext, use } from "react";

export interface ApiClient { get<T>(url: string, signal?: AbortSignal): Promise<T> }
const ApiClientContext = createContext<ApiClient | null>(null);
export const ApiClientProvider = ApiClientContext;

export function useApiClient(): ApiClient {
  const c = use(ApiClientContext);
  if (!c) throw new Error("useApiClient must be used within <ApiClientProvider>");
  return c;
}

export function useProducts() {
  const client = useApiClient();
  const [state, setState] = useState<
    { status: "loading" } | { status: "error"; message: string } | { status: "ready"; products: Product[] }
  >({ status: "loading" });
  useEffect(() => {
    const ctrl = new AbortController();
    client.get<Product[]>("/products", ctrl.signal).then(
      (products) => setState({ status: "ready", products }),
      (e: unknown) => { if (!ctrl.signal.aborted) setState({ status: "error", message: String(e) }); },
    );
    return () => ctrl.abort();
  }, [client]);
  return state;
}
export {};
