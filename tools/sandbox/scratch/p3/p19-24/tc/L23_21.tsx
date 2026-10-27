export {};
// 🔴
useEffect(() => { analytics.init(); }, []); // StrictMode runs it twice; remounts run it again
