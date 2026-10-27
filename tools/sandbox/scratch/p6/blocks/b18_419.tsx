import { useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';

function ProductRow({ p }: { p: Product }) {
  const qc = useQueryClient();
  const [sp] = useSearchParams();
  const next = new URLSearchParams(sp);
  next.set('item', String(p.id));

  return (
    <li>
      <Link
        to={{ search: next.toString() }}          // keeps all other params, adds ?item=ID; default navigation = push
        onMouseEnter={() => void qc.prefetchQuery(productDetailQuery(p.id))}
      >
        {p.name}
      </Link>
    </li>
  );
}

function DetailPanel() {
  const [sp, setSp] = useSearchParams();
  const raw = sp.get('item');
  const id = raw && /^\d+$/.test(raw) ? Number(raw) : null;      // validate; never trust
  const { data, isError } = useQuery({ ...productDetailQuery(id ?? 0), enabled: id !== null });

  if (id === null) return null;
  if (isError) return <p role="alert">Product not found. <button onClick={() => close()}>Close</button></p>;
  if (!data) return <p>Loading…</p>;

  function close() {
    const next = new URLSearchParams(sp);
    next.delete('item');
    setSp(next, { replace: true }); // closing shouldn't create a forward/back ping-pong
  }
  return <aside><h2>{data.name}</h2><button onClick={close}>Close</button></aside>;
}
export {};
