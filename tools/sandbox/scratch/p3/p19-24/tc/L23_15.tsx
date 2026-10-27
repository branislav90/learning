export {};
// 🔴
function Search({ filters }: { filters: string[] }) {
  const options = { limit: 10, filters }; // new object each render
  useEffect(() => { load(options).then(setData); }, [options]); // runs every render → setData → render → ...
}
