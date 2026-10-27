export {};
// 🔴 silencing the linter: the effect SHOULD re-run when `query` changes
const doSearch = useEffectEvent(() => fetchResults(query));
useEffect(() => { doSearch(); }, []);       // never re-fetches when query changes

// 🔴 calling from an event handler / passing to a child → not allowed
<button onClick={() => onConnected()} />   // lint error; use a normal function
<Child onSomething={onConnected} />        // lint error
