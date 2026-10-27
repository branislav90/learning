function rng(seed: number) { let s = seed; return () => (s = (s * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32; }
for (let seed = 1; seed <= 500; seed++) {
  const r = rng(seed); let state = initialCart;
  for (let i = 0; i < 50; i++) {
    const action = randomAction(r);
    deepFreeze(state);
    const a = cartReducer(state, action), b = cartReducer(state, action);
    expect(a).toEqual(b);
    assertInvariants(a);
    state = a;
  }
}
export {};
