export {};
// 🔴
const [text, setText] = useState('');
const [, startTransition] = useTransition();

<input
  value={text}
  onChange={(e) => startTransition(() => setText(e.target.value))}
/>
