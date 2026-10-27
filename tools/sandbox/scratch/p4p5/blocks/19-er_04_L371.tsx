function SaveButton() {
  const save = useMutation({ mutationFn: saveDraft });        // owns status/error (lesson 16)
  return (
    <>
      <button disabled={save.isPending} onClick={() => save.mutate()}>Save</button>
      {save.isError && <p role="alert">We couldn't save. {friendly(save.error)} <button onClick={() => save.mutate()}>Retry</button></p>}
    </>
  );
}
export {};
