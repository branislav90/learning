function Pagination({ page, onPageChange, total }: { page: number; onPageChange: (p: number) => void; total: number }) { … }
// every call site: const [page, setPage] = useState(1); <Pagination page={page} onPageChange={setPage} total={…} />
export {};
