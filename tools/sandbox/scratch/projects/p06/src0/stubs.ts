import { z } from "zod";
export interface CatalogFilters { q?: string; page?: number }
export interface ProductSummary { id: string; name: string }
export interface ProductDetail extends ProductSummary { description?: string }
export interface CatalogPage { items: ProductSummary[] }
export interface CartLine { productId: string; variantId: string; quantity: number }
export interface Cart { lines: CartLine[]; itemCount: number; totals: { total: number; provisional?: boolean } }
export const toProductDetailSeed = (p: ProductSummary): ProductDetail => p;
export const catalogApi = { list: async (_f: CatalogFilters, _s?: AbortSignal): Promise<CatalogPage> => ({ items: [] }), get: async (id: string, _s?: AbortSignal): Promise<ProductDetail> => ({ id, name: id }) };
export const cartApi = { get: async (_s?: AbortSignal): Promise<Cart> => ({ lines: [], itemCount: 0, totals: { total: 0 } }), setQuantity: async (_v: { productId: string; variantId: string; quantity: number }): Promise<Cart> => ({ lines: [], itemCount: 0, totals: { total: 0 } }) };
export const reviewsOptions = (_id: string) => ({ queryKey: ["r"], queryFn: async () => [] as string[] });
export const checkoutSchema = z.object({ name: z.string() });
export const emptyCart = (): Cart => ({ lines: [], itemCount: 0, totals: { total: 0 } });
export const orderKeys = { detail: (id: string) => ["orders", "detail", id] as const, list: (u: string) => ["orders", u] as const };
export const checkoutApi = { placeOrder: async (_d: unknown, _k: string) => ({ id: "o1" }) };
export const cartKeys0 = 1;
