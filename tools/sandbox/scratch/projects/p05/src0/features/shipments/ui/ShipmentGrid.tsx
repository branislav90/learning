// features/shipments/ui/ShipmentGrid.tsx
import { useRef, useMemo, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useInfiniteQuery } from '@tanstack/react-query'
import { shipmentsInfiniteOptions } from '../api/queries'
import { ShipmentRow } from './ShipmentRow'
import type { ShipmentFilters } from '../model/filters'

const ROW_HEIGHT = 44
const OVERSCAN = 8

export function ShipmentGrid({ filters }: { filters: ShipmentFilters }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPlaceholderData } =
    useInfiniteQuery(shipmentsInfiniteOptions(filters))

  const rows = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data])
  const total = data?.pages[0]?.total ?? 0

  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: hasNextPage ? rows.length + 1 : rows.length, // +1 = loader row
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    getItemKey: (index) => rows[index]?.id ?? `loader-${index}`, // stable keys across sorts
  })

  const items = virtualizer.getVirtualItems()
  const lastIndex = items.at(-1)?.index ?? -1

  useEffect(() => {
    if (lastIndex >= rows.length - 1 && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [lastIndex, rows.length, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div
      ref={parentRef}
      role="grid"
      aria-rowcount={total + 1 /* header */}
      aria-busy={isPlaceholderData}
      className={isPlaceholderData ? 'grid grid--stale' : 'grid'}
      style={{ height: '100%', overflow: 'auto', contain: 'strict' }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {items.map((vi) => {
          const row = rows[vi.index]
          return (
            <div
              key={vi.key}
              role="row"
              aria-rowindex={vi.index + 2}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: vi.size,
                transform: `translateY(${vi.start}px)`,
              }}
            >
              {row ? <ShipmentRow shipment={row} /> : <RowSkeleton />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
function RowSkeleton() { return <div className="row row--skeleton" aria-hidden /> }
