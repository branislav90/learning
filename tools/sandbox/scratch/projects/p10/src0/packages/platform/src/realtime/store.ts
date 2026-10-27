// packages/platform/src/realtime/store.ts
export interface VehicleLive { id: string; seq: number; lat: number; lng: number; status: 'moving' | 'idle' | 'offline'; speedKph: number; at: number }

type Listener = () => void;

export class VehicleStore {
  private data = new Map<string, VehicleLive>();
  private pending = new Map<string, VehicleLive>();
  private keyListeners = new Map<string, Set<Listener>>();
  private allListeners = new Set<Listener>();
  private scheduled = false;
  private version = 0;

  /** Called from the socket, many times per frame. Cheap: only buffers. */
  push(update: VehicleLive): void {
    const current = this.pending.get(update.id) ?? this.data.get(update.id);
    if (current && update.seq <= current.seq) return;               // stale or duplicate: drop
    this.pending.set(update.id, update);
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());                     // at most one notification wave per frame
    }
  }

  private flush(): void {
    this.scheduled = false;
    if (this.pending.size === 0) return;
    const changedIds: string[] = [];
    for (const [id, v] of this.pending) { this.data.set(id, v); changedIds.push(id); }
    this.pending.clear();
    this.version++;
    for (const id of changedIds) this.keyListeners.get(id)?.forEach((l) => l());
    this.allListeners.forEach((l) => l());
  }

  /** Replace everything from a REST snapshot, then keep only buffered deltas newer than it. */
  resetFromSnapshot(snapshot: VehicleLive[]): void {
    const buffered = new Map(this.pending);
    this.data = new Map(snapshot.map((v) => [v.id, v]));
    this.pending.clear();
    for (const v of buffered.values()) this.push(v);                 // seq filter drops older ones
    this.version++;
    this.keyListeners.forEach((ls) => ls.forEach((l) => l()));
    this.allListeners.forEach((l) => l());
  }

  // useSyncExternalStore contract: snapshots must be referentially stable between changes.
  getVehicle = (id: string): VehicleLive | undefined => this.data.get(id);
  getVersion = (): number => this.version;
  getIds = (() => { let cacheV = -1; let cache: string[] = []; return () => { if (cacheV !== this.version) { cache = [...this.data.keys()]; cacheV = this.version; } return cache; }; })();

  subscribeKey = (id: string, l: Listener) => {
    let set = this.keyListeners.get(id);
    if (!set) this.keyListeners.set(id, (set = new Set()));
    set.add(l);
    return () => { set!.delete(l); if (set!.size === 0) this.keyListeners.delete(id); };
  };
  subscribeAll = (l: Listener) => { this.allListeners.add(l); return () => { this.allListeners.delete(l); }; };
}
