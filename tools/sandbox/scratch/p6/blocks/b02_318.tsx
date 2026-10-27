const mounted = useRef(true);
useEffect(() => () => { mounted.current = false; }, []);

useEffect(() => {
  fetch(`/api/items/${id}`).then(r => r.json()).then((d) => {
    if (mounted.current) setItem(d);   // BUG
  });
}, [id]);
export {};
