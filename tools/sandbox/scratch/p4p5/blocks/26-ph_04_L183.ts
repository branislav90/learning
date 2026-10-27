// features/cart/index.ts
export * from "./model/cart";
export * from "./ui/CartButton";

// features/cart/ui/CartButton.tsx
import { useUser } from "@/features/user";

// features/user/index.ts
export * from "./model/user";

// features/user/model/user.ts
import { cartCount } from "@/features/cart";
export const useUser = () => ({ badge: cartCount() });
export {};
