function App() {
  return <Clock><Expensive /></Clock>;
}

function Clock({ children }: { children: React.ReactNode }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{t}{children}</div>;
}

function Expensive() {
  console.log("Expensive render");
  return <p>static</p>;
}
export {};
