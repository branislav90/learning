function sum(n: number): number { return n === 0 ? 0 : n + sum(n - 1); }
sum(1e6); // RangeError in common engines
