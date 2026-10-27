startTransition(() => setN(x => x + 1));  // T: lane = transition
setN(x => x * 2);                          // U: lane = sync
