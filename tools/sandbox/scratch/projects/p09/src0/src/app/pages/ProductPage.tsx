// src/app/pages/ProductPage.tsx
import type { Product } from '../types';
import { RegionBoundary } from '../components/RegionBoundary';
import { Reviews } from '../components/Reviews';
import { Inventory } from '../components/Inventory';
import { ReviewForm } from '../components/ReviewForm';
import { AddToCart } from '../components/AddToCart';
import { ReviewsSkeleton, InventorySkeleton } from '../components/skeletons';

export function ProductPage({ product }: { product: Product }) {
  return (
    <main>
      {/* React 19 hoists these into <head>, also during streaming SSR */}
      <title>{`${product.name} | Trailhead Gear`}</title>
      <meta name="description" content={product.summary} />
      <link rel="canonical" href={`https://example.test/products/${product.slug}`} />

      <h1>{product.name}</h1>
      <img src={product.heroUrl} alt={product.heroAlt} width={800} height={600} fetchPriority="high" />
      <p>{product.description}</p>

      <section aria-labelledby="stock-h">
        <h2 id="stock-h">Availability</h2>
        <RegionBoundary fallback={<InventorySkeleton />} errorFallback={<p>Availability unavailable. Check in store.</p>}>
          <Inventory slug={product.slug} />
        </RegionBoundary>
        <AddToCart productId={product.id} />
      </section>

      <section aria-labelledby="rev-h">
        <h2 id="rev-h">Reviews</h2>
        <RegionBoundary fallback={<ReviewsSkeleton />} errorFallback={<p>Reviews are temporarily unavailable.</p>}>
          <Reviews slug={product.slug} />
        </RegionBoundary>
        <ReviewForm slug={product.slug} />
      </section>
    </main>
  );
}
