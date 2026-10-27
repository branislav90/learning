export {};
type Cart = { items: readonly CartItem[] };
type State =
  | { step: "cart"; cart: Cart }
  | { step: "shipping"; cart: Cart; address: Address | null }
  | { step: "payment"; cart: Cart; address: Address; method: Method | null }
  | { step: "confirmation"; cart: Cart; address: Address; method: Method; orderId: string };
type Action =
  | { type: "toShipping" }
  | { type: "setAddress"; address: Address }
  | { type: "toPayment" }
  | { type: "setMethod"; method: Method }
  | { type: "place"; orderId: string }
  | { type: "back" };
