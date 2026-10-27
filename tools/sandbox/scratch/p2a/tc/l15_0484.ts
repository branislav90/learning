type Lane = "urgent" | "transition";

interface Update {
  lane: Lane;
  value: string;
}

interface Draft {
  lane: Lane;
  value: string;
  next: number;      // index of the next unit (the "fiber pointer")
  out: string[];     // the work-in-progress output
}

type SliceResult = "idle" | "yielded" | "committed";

export class ToyRoot {
  committed: string[] = [];          // what the user sees (root.current)
  discarded = 0;                     // abandoned drafts
  private queue: Update[] = [];      // persistent update queue (survives abandonment)
  private draft: Draft | null = null;

  constructor(
    private readonly total: number,
    private readonly renderUnit: (value: string, index: number) => string,
  ) {}

  dispatch(update: Update): void {
    this.queue.push(update);
  }

  /** Highest-priority lane with pending updates. */
  private pickLane(): Lane | null {
    if (this.queue.some((u) => u.lane === "urgent")) return "urgent";
    return this.queue.length > 0 ? "transition" : null;
  }

  /** The value this lane would render: last eligible update wins (toy semantics). */
  private valueFor(lane: Lane): string {
    const eligible = this.queue.filter((u) => lane === "transition" || u.lane === "urgent");
    return eligible[eligible.length - 1].value;
  }

  /** Do at most `maxUnits` units of work, then yield. */
  slice(maxUnits: number): SliceResult {
    const lane = this.pickLane();
    if (lane === null) return "idle";
    const value = this.valueFor(lane);

    // Restart rule: different lane, or same lane with different inputs => abandon the draft.
    if (this.draft && (this.draft.lane !== lane || this.draft.value !== value)) {
      this.draft = null;
      this.discarded++;
    }
    const draft = (this.draft ??= { lane, value, next: 0, out: [] });

    let used = 0;
    while (draft.next < this.total && used < maxUnits) {   // "shouldYield" = budget exhausted
      draft.out.push(this.renderUnit(draft.value, draft.next));
      draft.next++;
      used++;
    }
    if (draft.next < this.total) return "yielded";          // resumable: draft kept

    // Commit: synchronous and atomic.
    this.committed = draft.out;
    this.queue = this.queue.filter((u) => lane === "urgent" && u.lane !== "urgent");
    this.draft = null;
    return "committed";
  }
}
