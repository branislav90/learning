export {};
type Cents = number & { readonly __brand: "Cents" };
const toCents = (dollars: number): Cents => Math.round(dollars * 100) as Cents;
const addCents = (a: Cents, b: Cents): Cents => (a + b) as Cents;
