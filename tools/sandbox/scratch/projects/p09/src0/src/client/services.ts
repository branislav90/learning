import type { Services } from '../app/services-types';
export function createClientServices(): Services { return { getReviews: async () => [], getStock: async () => ({ inStock: 0 }), getProduct: async () => null }; }
