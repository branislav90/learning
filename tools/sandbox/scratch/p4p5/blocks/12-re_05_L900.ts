function reducer(s: S, a: A): S {
  if (a.type === "saved") { analytics.track("saved"); return { ...s, savedAt: new Date(), id: nanoid() }; }
  return s;
}
export {};
