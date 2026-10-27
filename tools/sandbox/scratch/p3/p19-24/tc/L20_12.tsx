export {};
// (a) select the stable source and derive afterwards
const items = useStore(cartStore, (s) => s.items);
const multi = useMemo(() => items.filter((i) => i.qty > 1), [items]);

// (b) use an equality-aware selector helper (library-provided) that returns the previous result when shallow-equal
//     e.g. a `useShallow`-style wrapper, or a with-selector variant of uSES.
