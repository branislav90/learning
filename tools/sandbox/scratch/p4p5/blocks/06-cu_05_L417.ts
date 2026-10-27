useInterval(() => tick(), 1000, { immediate: true });   // new options object each render
// inside the hook: useEffect(..., [callback, delay, options])  -> resets timer every render
export {};
