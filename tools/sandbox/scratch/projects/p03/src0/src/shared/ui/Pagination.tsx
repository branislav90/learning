import { useSearchParams } from "react-router";
export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const [, set] = useSearchParams();
  return <nav aria-label="Pagination"><button disabled={page <= 1} onClick={() => set((p) => { p.set("page", String(page - 1)); return p; })}>Prev</button> {page}/{pageCount} <button disabled={page >= pageCount} onClick={() => set((p) => { p.set("page", String(page + 1)); return p; })}>Next</button></nav>;
}
