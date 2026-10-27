export {};
const [text, setText] = useState('');          // urgent
const [query, setQuery] = useState('');        // non-urgent copy driving the expensive tree
const [, startTransition] = useTransition();

<input
  value={text}
  onChange={(e) => {
    setText(e.target.value);
    startTransition(() => setQuery(e.target.value));
  }}
/>
<ResultList query={query} />
