const [filtered, setFiltered] = useState<Item[]>([]);
useEffect(() => { setFiltered(items.filter(i => i.name.includes(query))); }, [items, query]);
export {};
