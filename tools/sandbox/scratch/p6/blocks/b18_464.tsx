// TanStack Router style (⚠ illustrative; verify current API)
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().catch(''),
  sort: z.enum(['relevance', 'price-asc', 'price-desc']).catch('relevance'),
  page: z.number().int().min(1).catch(1),
});

export const Route = createFileRoute('/products')({
  validateSearch: searchSchema,
});

// In a component: const { q, sort, page } = Route.useSearch();
// Navigating:     <Link to="/products" search={(prev) => ({ ...prev, page: 2 })} />
export {};
