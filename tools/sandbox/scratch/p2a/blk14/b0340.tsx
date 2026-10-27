let analyticsCount = 0;

export function Broken() {
  const [n, setN] = useState(1);
  const [, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(() => setN(n + 1));          // (1) captured value: always "1 + 1"
        setN(n * 2);                                  // (2) captured value: always "1 * 2"
        setN((x) => {
          analyticsCount += 1;                        // (3) side effect inside an updater
          return x + 10;
        });
      }}
    >
      {n}
    </button>
  );
}
