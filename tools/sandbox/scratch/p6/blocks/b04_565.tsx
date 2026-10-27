type Brand<T, B extends string> = T & { readonly __brand: B };
export type OrderId = Brand<string, 'OrderId'>;
export type CustomerId = Brand<string, 'CustomerId'>;

export const OrderId = (s: string) => s as OrderId;       // the only unchecked cast, at the boundary
// orders.byId[customerId]  -> compile error: CustomerId is not OrderId (when tables are typed by id brand)
export {};
