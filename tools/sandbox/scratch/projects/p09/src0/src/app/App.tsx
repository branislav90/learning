import { use } from 'react';
import { Document } from './Document';
import { DataProvider, type AppData } from './data/context';
import { ProductPage } from './pages/ProductPage';
import type { Route } from './routes';
import type { Product } from './types';

function Routed({ route, data }: { route: Route; data: AppData }) {
  if (route.name === 'product') {
    const product = use(data.cache.read<Product | null>(`product:${route.slug}`, () => data.services.getProduct(route.slug)));
    return product ? <ProductPage product={product} /> : <main><h1>Not found</h1></main>;
  }
  return <main><h1>{route.name}</h1></main>;
}
export function App({ route, data, now, nonce, devPreamble, critical }: { route: Route; data: AppData; now: number; nonce?: string; devPreamble?: boolean; critical?: Record<string, unknown> }) {
  return (
    <DataProvider value={data}>
      <Document now={now} nonce={nonce} devPreamble={devPreamble} critical={critical}>
        <Routed route={route} data={data} />
      </Document>
    </DataProvider>
  );
}
