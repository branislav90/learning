interface ShippingStrategy { label: string; etaDays: number; costMinor: (o: Order) => number }

export const shipping = {
  standard: { label: 'Standard', etaDays: 5, costMinor: (o) => (o.totalMinor >= 5000 ? 0 : 499) },
  express:  { label: 'Express',  etaDays: 1, costMinor: () => 1299 },
  pickup:   { label: 'Pickup',   etaDays: 0, costMinor: () => 0 },
} as const satisfies Record<string, ShippingStrategy>;
export type ShippingKey = keyof typeof shipping;

export function ShippingPicker({ order, value, onChange }: {
  order: Order; value: ShippingKey; onChange: (k: ShippingKey) => void;
}) {
  return (
    <fieldset>
      <legend>Shipping</legend>
      {(Object.keys(shipping) as ShippingKey[]).map((k) => (
        <label key={k}>
          <input type="radio" name="shipping" checked={value === k} onChange={() => onChange(k)} />
          {shipping[k].label} — {(shipping[k].costMinor(order) / 100).toFixed(2)}, {shipping[k].etaDays} d
        </label>
      ))}
    </fieldset>
  );
}
export {};
