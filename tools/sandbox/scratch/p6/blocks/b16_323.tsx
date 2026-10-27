import { useQuery } from '@tanstack/react-query';

function JobList() {
  const q = useQuery(jobsQuery());

  if (q.status === 'pending') {
    return q.fetchStatus === 'paused'
      ? <p>Waiting for a connection… (nothing cached yet)</p>
      : <p>Loading jobs…</p>;
  }
  if (q.status === 'error' && !q.data) return <p role="alert">Couldn't load jobs.</p>;

  const stale = q.fetchStatus === 'paused' || q.isError;
  return (
    <>
      {stale && (
        <p role="status">
          Showing saved data from {new Date(q.dataUpdatedAt).toLocaleTimeString()}.
        </p>
      )}
      <ul>{q.data!.map((j) => <li key={j.id}>{j.title}</li>)}</ul>
    </>
  );
}
export {};
