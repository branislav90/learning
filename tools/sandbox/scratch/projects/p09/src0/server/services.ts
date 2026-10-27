import type { Services } from '../src/app/services-types';
export function createServices(): Services { return servicesImpl.current; }
export const servicesImpl: { current: Services } = { current: { getReviews: async () => [], getStock: async () => ({ inStock: 3 }), getProduct: async () => null } };
