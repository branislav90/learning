// sorting.ts
export interface SortStrategy<T> {
  label: string;
  compare: (a: T, b: T) => number;
}

export const productSorts = {
  'price-asc':  { label: 'Price: low to high', compare: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', compare: (a, b) => b.price - a.price },
  rating:       { label: 'Best rated',         compare: (a, b) => b.rating - a.rating },
  newest:       { label: 'Newest',             compare: (a, b) => +b.createdAt - +a.createdAt },
} as const satisfies Record<string, SortStrategy<Product>>;

export type SortKey = keyof typeof productSorts;

export function isSortKey(v: string | null): v is SortKey {
  return v !== null && Object.hasOwn(productSorts, v);
}
export {};
