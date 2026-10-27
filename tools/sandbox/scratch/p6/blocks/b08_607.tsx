const [page, setPage] = useState(0);
const { data } = useQuery({ queryKey: ['items'], queryFn: () => getItems(page) });
export {};
