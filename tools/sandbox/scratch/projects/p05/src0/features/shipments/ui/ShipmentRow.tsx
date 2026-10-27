// features/shipments/ui/ShipmentRow.tsx
import { memo, useSyncExternalStore } from 'react'
import { selectionStore } from '../model/selectionStore'
import type { Shipment } from '../api/types'

export const ShipmentRow = memo(function ShipmentRow({ shipment }: { shipment: Shipment }) {
  const selected = useSyncExternalStore(
    (l) => selectionStore.subscribeId(shipment.id, l),
    () => selectionStore.isSelected(shipment.id),
  )
  return (
    <div className={selected ? 'row row--selected' : 'row'} role="presentation">
      <input
        type="checkbox"
        checked={selected}
        aria-label={`Select ${shipment.reference}`}
        onChange={() => selectionStore.toggle(shipment.id)}
      />
      <span role="gridcell">{shipment.reference}</span>
      <span role="gridcell">{shipment.customer}</span>
      <span role="gridcell">{shipment.status}</span>
      {/* ... */}
    </div>
  )
})
