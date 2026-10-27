function useBusEvent<K extends keyof AppEvents>(type: K, handler: (p: AppEvents[K]) => void) {
  const ref = useRef(handler);
  useEffect(() => { ref.current = handler; });
  useEffect(() => bus.on(type, (p) => ref.current(p)), [type]);   // on() returns the cleanup
}
export {};
