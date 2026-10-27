export {};
// Branding: distinguish structurally identical primitives.
type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

const asUserId = (s: string): UserId => s as UserId;   // the only "cast" lives in one place

declare function getOrder(id: OrderId): void;
// getOrder(asUserId("u1"));    // error: UserId is not assignable to OrderId

// satisfies (TS 4.9+): check against a type without widening the inferred type.
const routes = {
  home: "/",
  user: "/users/:id",
} satisfies Record<string, string>;

routes.home;           // type: string (still precise keys: "home" | "user"), unlike annotating as Record<string,string>
