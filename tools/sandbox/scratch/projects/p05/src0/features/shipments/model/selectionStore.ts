// features/shipments/model/selectionStore.ts
type Listener = () => void

export class SelectionStore {
  private selected = new Set<string>()
  private perId = new Map<string, Set<Listener>>()
  private global = new Set<Listener>()
  private snapshotCount = 0
  private anchor: string | null = null

  // --- subscription surface -------------------------------------------------
  subscribeId = (id: string, l: Listener) => {
    let set = this.perId.get(id)
    if (!set) this.perId.set(id, (set = new Set()))
    set.add(l)
    return () => {
      set!.delete(l)
      if (set!.size === 0) this.perId.delete(id)
    }
  }
  subscribeCount = (l: Listener) => {
    this.global.add(l)
    return () => void this.global.delete(l)
  }

  // --- snapshots (must be referentially stable between changes) -------------
  isSelected = (id: string) => this.selected.has(id)
  getCount = () => this.snapshotCount

  // --- mutations -------------------------------------------------------------
  toggle(id: string) {
    this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id)
    this.anchor = id
    this.emit([id])
  }
  selectRange(orderedIds: readonly string[], toId: string) {
    const from = this.anchor ? orderedIds.indexOf(this.anchor) : -1
    const to = orderedIds.indexOf(toId)
    if (to === -1) return
    const [a, b] = from === -1 ? [to, to] : [Math.min(from, to), Math.max(from, to)]
    const changed: string[] = []
    for (let i = a; i <= b; i++) {
      const id = orderedIds[i]
      if (id !== undefined && !this.selected.has(id)) { this.selected.add(id); changed.push(id) }
    }
    this.emit(changed)
  }
  clear() {
    const changed = [...this.selected]
    this.selected.clear()
    this.anchor = null
    this.emit(changed)
  }
  ids = () => [...this.selected]

  private emit(changedIds: readonly string[]) {
    this.snapshotCount = this.selected.size
    // Only rows whose flag actually changed are notified.
    for (const id of changedIds) this.perId.get(id)?.forEach((l) => l())
    this.global.forEach((l) => l())
  }
}

export const selectionStore = new SelectionStore()
