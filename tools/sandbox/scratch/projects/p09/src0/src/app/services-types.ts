import type { Product, Review } from './types';
export interface Services { getReviews(slug: string): Promise<Review[]>; getStock(slug: string): Promise<{ inStock: number }>; getProduct(slug: string): Promise<Product | null> }
