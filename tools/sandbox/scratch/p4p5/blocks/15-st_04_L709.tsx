const [query, setQuery] = useState(searchParams.get("q") ?? "");
useEffect(() => { setSearchParams({ q: query }); }, [query]);
useEffect(() => { setQuery(searchParams.get("q") ?? ""); }, [searchParams]);
export {};
