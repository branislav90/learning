type View = "chart" | "other";

export function Report({ data }: { data: number[] }) {
  const [view, setView] = useState<View>("chart");
  return (
    <>
      <button onClick={() => setView(view === "chart" ? "other" : "chart")}>toggle</button>
      {view === "chart" ? <Chart data={data} /> : <p>other</p>}
    </>
  );
}
