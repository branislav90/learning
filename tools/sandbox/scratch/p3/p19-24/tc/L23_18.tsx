export {};
// 🔴
useEffect(async () => { const d = await load(); setData(d); }, []); // returns a Promise, not a cleanup function
