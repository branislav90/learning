// Server Component (RSC framework, ⚠ verify your framework): creates the promise, passes it down.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userPromise = getUser(id);                 // not awaited here
  return (
    <Suspense fallback={<p>Loading user…</p>}>
      <UserCard userPromise={userPromise} />
    </Suspense>
  );
}
export {};
