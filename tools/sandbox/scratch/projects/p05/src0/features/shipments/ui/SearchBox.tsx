// features/shipments/ui/SearchBox.tsx
import { useEffect, useState, useTransition } from 'react'

interface Props {
  value: string // committed value from the URL
  onCommit: (next: string) => void
}

export function SearchBox({ value, onCommit }: Props) {
  const [text, setText] = useState(value)
  const [isPending, startTransition] = useTransition()

  // Reflect external changes (back/forward, "clear filters") into the input.
  useEffect(() => setText(value), [value])

  return (
    <div role="search">
      <label htmlFor="shipment-search">Search shipments</label>
      <input
        id="shipment-search"
        value={text}
        onChange={(e) => {
          const next = e.target.value
          setText(next) // urgent: the keystroke must paint immediately
          startTransition(() => onCommit(next)) // non-urgent: URL + results
        }}
        aria-busy={isPending}
      />
      {isPending && <span aria-live="polite">Updating…</span>}
    </div>
  )
}
