function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState(() => iso.slice(0, 16).replace('T', ' ') + ' UTC'); // deterministic initial
  useEffect(() => {
    setText(new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)));
  }, [iso]);
  return <time dateTime={iso}>{text}</time>;
}
export {};
