import { memo, useState, type ReactNode } from "react";

function Dashboard() {
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultsHeader />          {/* A */}
      <MemoFooter />             {/* B */}
    </>
  );
}

function ResultsHeader() {
  console.log("ResultsHeader render");
  return <h2>Results</h2>;
}

const MemoFooter = memo(function Footer() {
  console.log("Footer render");
  return <footer>© Acme</footer>;
});
export {};
