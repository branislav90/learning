// legacy/pricing.js
export function totalWithVat(items, rate) {
  let t = 0;
  for (const i of items) t += i.price * i.qty;
  return Math.round(t * (1 + rate) * 100) / 100;
}
export {};
