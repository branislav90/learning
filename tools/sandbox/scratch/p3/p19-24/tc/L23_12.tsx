export {};
// 🔴 each effect triggers a re-render that triggers the next effect
useEffect(() => { setB(f(a)); }, [a]);
useEffect(() => { setC(g(b)); }, [b]);
useEffect(() => { setD(h(c)); }, [c]);
