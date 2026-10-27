// ❌ Server state managed as client state
interface AppState {
  user: User | null;
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  selectedProductId: string | null;
  filters: { color: string | null; sort: string };
  sidebarOpen: boolean;
}

const useAppStore = create<AppState & { loadProducts: () => Promise<void> }>((set, get) => ({
  user: null, products: [], productsLoading: false, productsError: null,
  selectedProductId: null, filters: { color: null, sort: 'relevance' }, sidebarOpen: true,
  loadProducts: async () => {
    set({ productsLoading: true });
    try {
      const res = await fetch(`/api/products?color=${get().filters.color ?? ''}`);
      set({ products: await res.json(), productsLoading: false });
    } catch (e) {
      set({ productsError: String(e), productsLoading: false });
    }
  },
}));
export {};
