function Page() {
  try {
    return <Risky />;      // Risky throws during render
  } catch {
    return <p>Failed</p>;
  }
}
export {};
