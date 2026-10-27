function SaveButton({ doc }: { doc: Doc }) {
  async function onClick() {
    await saveDocument(doc);          // rejects with a 500
  }
  return <button onClick={onClick}>Save</button>;
}

// elsewhere
<ErrorBoundary FallbackComponent={Fallback}>
  <SaveButton doc={doc} />
</ErrorBoundary>
export {};
