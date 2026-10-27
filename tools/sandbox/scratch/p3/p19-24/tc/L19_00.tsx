export {};
function Invoices() {
  const [data, setData] = useState<Invoice[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/invoices')
      .then((r) => r.json())
      .then(setData)
      .catch(setError);
  }, []);
  // ...
}
