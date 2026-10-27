// BUG: new object every call -> "getSnapshot should be cached" warning / render loop
const snap = useSyncExternalStore(subscribe, () => ({ width: window.innerWidth }));
export {};
