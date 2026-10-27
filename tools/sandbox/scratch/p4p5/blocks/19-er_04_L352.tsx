function SaveButton() {
  const save = async () => {
    const res = await fetch("/api/save", { method: "POST" });
    if (!res.ok) throw new Error("Save failed");     // thrown inside an async event handler
  };
  return <button onClick={save}>Save</button>;
}

// parent
<ErrorBoundary fallback={<p>Something went wrong</p>}><SaveButton /></ErrorBoundary>
export {};
