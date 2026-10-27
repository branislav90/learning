try {
  setTimeout(() => { throw new Error("late"); }, 0);
} catch { /* never runs */ }
