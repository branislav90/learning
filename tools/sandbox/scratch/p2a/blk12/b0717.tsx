export function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value as Record<string, unknown>)) deepFreeze(v);
  }
  return value;
}

// test
it("does not mutate props", () => {
  const props = deepFreeze({ names: ["b", "a"] });
  expect(() => renderToStaticMarkup(<SortedNames {...props} />)).not.toThrow();
});
