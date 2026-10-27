private lastSeq = new Map<string, number>();
private onGap: (topic: string) => void;

private accept(ev: ServerEvent & { seq: number }): boolean {
  const last = this.lastSeq.get(ev.topic);
  if (last !== undefined && ev.seq <= last) return false;            // duplicate / old
  if (last !== undefined && ev.seq > last + 1) {                      // gap
    this.lastSeq.delete(ev.topic);                                    // force fresh baseline
    this.onGap(ev.topic);
    return false;
  }
  this.lastSeq.set(ev.topic, ev.seq);
  return true;
}
export {};
