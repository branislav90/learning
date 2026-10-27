if (rows.length === 0) {
  if (!renderEmpty && process.env.NODE_ENV !== "production") {
    console.warn("<List> received empty rows and no renderEmpty slot.");
  }
  return <>{renderEmpty?.() ?? <p>No items.</p>}</>;
}
export {};
