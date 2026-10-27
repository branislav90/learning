function Todos({ todos, add }: { todos: Todo[]; add: (t: string) => Promise<void> }) {
  const [optimistic, addOptimistic] = useOptimistic(
    todos,
    (current, title: string): Todo[] => [...current, { id: `tmp-${title}`, title, pending: true }],
  );
  async function action(formData: FormData) {
    const title = String(formData.get("title"));
    addOptimistic(title);           // must be called inside an Action / transition
    await add(title);               // when the transition ends, `todos` (new truth) replaces optimistic state
  }
  return (
    <form action={action}>
      <input name="title" />
      <ul>{optimistic.map((t) => <li key={t.id} aria-busy={t.pending}>{t.title}</li>)}</ul>
    </form>
  );
}
export {};
