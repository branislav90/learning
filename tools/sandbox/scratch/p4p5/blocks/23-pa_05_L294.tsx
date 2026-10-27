// After
type State = { error: string | null };

function Rename({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      try {
        await rename(id, String(formData.get("name") ?? ""));
        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed" };
      }
    },
    { error: null },
  );
  return (
    <form action={action}>
      <input name="name" defaultValue="" />
      <button disabled={pending}>Save</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
export {};
