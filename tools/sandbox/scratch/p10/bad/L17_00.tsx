import { useQuery } from '@tanstack/react-query';

export interface UseOrderResult {
  /** The order, or `undefined` while loading or on error. */
  order: Order | undefined;
  /** `true` only for the first load; background refetches do not set it. */
  isLoading: boolean;
  /** Present when the request failed after retries. */
  error: Error | null;
}

/**
 * Loads one order by id and keeps it fresh in the background.
 *
 * @remarks
 * Uses the shared query cache; two components calling `useOrder('42')`
 * issue a single request. The cache entry is invalidated by
 * `useCancelOrder` and `useUpdateShippingAddress`.
 *
 * Data is considered fresh for 30 seconds (see ADR-0014 for the staleness policy).
 *
 * @param orderId - Order identifier. Pass `undefined` to disable the query (e.g., before the route param is known).
 * @returns Loading state, order data, and error. See {@link UseOrderResult}.
 *
 * @example
 * 