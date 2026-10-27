<NumberField value={qty} onChange={(n) => setQty(Math.min(99, Math.max(1, n)))} />
export {};
