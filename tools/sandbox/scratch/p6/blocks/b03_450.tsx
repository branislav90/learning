import { useState, useTransition } from 'react';

export function ProductBrowser() {
  const [category, setCategory] = useState('all');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <CategoryTabs
        value={category}
        onChange={(next) => startTransition(() => setCategory(next))}
      />
      <div aria-busy={isPending} style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid category={category} />   {/* suspends while loading new category */}
        </Suspense>
      </div>
    </>
  );
}
export {};
