import { useState } from "react";

function parseLargeJson(raw: string): Map<string, number> { /* expensive */ return new Map(); }

// ❌ Incorrect
export function BadTable({ raw }: { raw: string }) {
  const [index] = useState(parseLargeJson(raw));   // parseLargeJson runs on EVERY render
  return <div>{index.size}</div>;
}

// ✅ Correct
export function GoodTable({ raw }: { raw: string }) {
  const [index] = useState(() => parseLargeJson(raw));   // runs on mount only
  return <div>{index.size}</div>;
}
