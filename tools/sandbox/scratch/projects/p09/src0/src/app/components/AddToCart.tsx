import { useState } from 'react';
export function AddToCart({ productId }: { productId: string }) { const [n, setN] = useState(0); return <button data-id={productId} onClick={() => setN(n + 1)}>Add ({n})</button>; }
