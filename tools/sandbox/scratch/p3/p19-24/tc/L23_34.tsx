export {};
function Child({ config }: { config: { page: number } }) {
  useEffect(() => { load(config); }, [config]);
}
// parent: <Child config={{ page: 1 }} />
