const [items, setItems] = useState<Item[]>([]);
const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
const [error, setError] = useState<string | null>(null);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
export {};
