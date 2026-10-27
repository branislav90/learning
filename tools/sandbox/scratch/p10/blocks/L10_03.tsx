// Route loader: any failure kills the page; optional data blocks critical data
export async function loader({ params }: LoaderArgs) {
  const [product, recs, reviews, inventory] = await Promise.all([
    getProduct(params.id),
    getRecommendations(params.id),     // optional
    getReviews(params.id),             // optional
    getInventory(params.id),
  ]);
  return { product, recs, reviews, inventory };
}

// Component: retry forever, no backoff
function useThing() {
  const [data, setData] = useState<Thing | null>(null);
  useEffect(() => {
    let alive = true;
    (async function go() {
      try { setData(await getThing()); }
      catch { if (alive) setTimeout(go, 1000); }       // ❌ constant interval, forever, synchronized across clients
    })();
    return () => { alive = false };                     // ❌ timer not cleared; request not aborted
  }, []);
  return data;
}
