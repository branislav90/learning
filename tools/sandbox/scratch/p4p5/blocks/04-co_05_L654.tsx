function Parent() { const [n, setN] = useState(0); return <><button onClick={() => setN(n+1)}>{n}</button><Heavy /></>; }
function Parent2({ children }: { children: React.ReactNode }) { const [n, setN] = useState(0); return <><button onClick={() => setN(n+1)}>{n}</button>{children}</>; }
// usage: <Parent2><Heavy /></Parent2>
export {};
