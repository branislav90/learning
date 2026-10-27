function Page() {
  const [n, setN] = useState(0);
  useEffect(() => { console.log("effect", n); return () => console.log("cleanup", n); }, [n]);
  return <button onClick={() => setN(n + 1)}>click</button>;
}
export {};
