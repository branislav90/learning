export function Fixed({ onAddedToCart }: { onAddedToCart: (qty: number) => void }) {
  const [n, setN] = useState(1);
  const [, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(() => setN((x) => x + 1)); // functional: composes with other updates
        setN((x) => x * 2);
        setN((x) => x + 10);                        // pure updater
        onAddedToCart(n);                           // side effect in the HANDLER, once per click
      }}
    >
      {n}
    </button>
  );
}
