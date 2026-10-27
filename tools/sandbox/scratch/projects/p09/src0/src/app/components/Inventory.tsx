import { use } from 'react';
import { useAppData } from '../data/context';
export function Inventory({ slug }: { slug: string }) { const { cache, services } = useAppData(); const s = use(cache.read(`stock:${slug}`, () => services.getStock(slug))); return <p>{s.inStock} in stock</p>; }
