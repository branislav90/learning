type Deps = readonly unknown[] | undefined;
type Cleanup = void | (() => void);

interface Hook {
  state: unknown;
  next: Hook | null;
}
interface StateCell<S> {
  value: S;
  queue: Array<S | ((prev: S) => S)>;
  dispatch: (a: S | ((prev: S) => S)) => void;
}
interface EffectCell {
  create: () => Cleanup;
  deps: Deps;
  destroy: (() => void) | undefined;
}

let current: Instance<any> | null = null;           // "currentlyRenderingFiber"

class Instance<P> {
  private head: Hook | null = null;
  private tail: Hook | null = null;                  // used while mounting
  private cursor: Hook | null = null;                // used while updating
  isMount = true;
  dirty = false;
  private pendingEffects: EffectCell[] = [];

  constructor(private readonly component: (p: P) => string) {}

  /** The "mount/update dispatcher" collapsed into one method. */
  nextHook(): Hook {
    if (this.isMount) {
      const h: Hook = { state: undefined, next: null };
      if (this.tail) this.tail.next = h; else this.head = h;
      this.tail = h;
      return h;
    }
    const h = this.cursor;
    if (h === null) throw new Error("Rendered more hooks than during the previous render.");
    this.cursor = h.next;
    return h;
  }

  scheduleEffect(e: EffectCell) { this.pendingEffects.push(e); }

  /** render + "commit" + passive effects, synchronously, for demonstration. */
  render(props: P): string {
    current = this;
    this.cursor = this.head;
    this.pendingEffects = [];
    let out: string;
    try {
      out = this.component(props);
    } finally {
      current = null;                                // later stray hook calls fail loudly
    }
    if (!this.isMount && this.cursor !== null) {
      throw new Error("Rendered fewer hooks than expected.");
    }
    this.isMount = false;
    this.dirty = false;
    // passive-effect flush: all cleanups first, then all setups (like React)
    for (const e of this.pendingEffects) e.destroy?.();
    for (const e of this.pendingEffects) {
      const d = e.create();
      e.destroy = typeof d === "function" ? d : undefined;
    }
    return out;
  }
}

function inst(): Instance<any> {
  if (current === null) throw new Error("Invalid hook call.");
  return current;
}

export function useState<S>(initial: S | (() => S)): [S, StateCell<S>["dispatch"]] {
  const i = inst();
  const hook = i.nextHook();
  if (i.isMount) {
    const cell: StateCell<S> = {
      value: typeof initial === "function" ? (initial as () => S)() : initial,
      queue: [],
      dispatch: (a) => { cell.queue.push(a); i.dirty = true; },   // bound to THIS instance's cell: stable identity
    };
    hook.state = cell;
  }
  const cell = hook.state as StateCell<S>;
  for (const a of cell.queue) cell.value = typeof a === "function" ? (a as (p: S) => S)(cell.value) : a;
  cell.queue = [];
  return [cell.value, cell.dispatch];
}

export function useRef<T>(initial: T): { current: T } {
  const i = inst();
  const hook = i.nextHook();
  if (i.isMount) hook.state = { current: initial };
  return hook.state as { current: T };
}

function depsChanged(a: Deps, b: Deps): boolean {
  if (a === undefined || b === undefined) return true;
  return a.length !== b.length || a.some((x, k) => !Object.is(x, b[k]));
}

export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T {
  const i = inst();
  const hook = i.nextHook();
  const prev = hook.state as { value: T; deps: Deps } | undefined;
  if (prev === undefined || depsChanged(prev.deps, deps)) {
    hook.state = { value: factory(), deps };
  }
  return (hook.state as { value: T }).value;
}

export function useEffect(create: () => Cleanup, deps?: Deps): void {
  const i = inst();
  const hook = i.nextHook();
  const prev = hook.state as EffectCell | undefined;
  if (prev === undefined) {
    const cell: EffectCell = { create, deps, destroy: undefined };
    hook.state = cell;
    i.scheduleEffect(cell);
  } else if (depsChanged(prev.deps, deps)) {
    prev.create = create;                       // keep `destroy` from the previous run
    prev.deps = deps;
    i.scheduleEffect(prev);
  }                                            // else: unchanged → skipped (no HasEffect tag)
}

export { Instance };
