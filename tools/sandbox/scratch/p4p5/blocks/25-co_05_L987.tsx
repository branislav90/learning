function NameForm({ initial }: { initial: { first: string; last: string } }) {
  const [first, setFirst] = useState(initial.first);
  const [last, setLast] = useState(initial.last);
  const fullName = `${first} ${last}`.trim();
  const isValid = first.length > 0 && last.length > 0;
  /* … */
}
// Parent resets by remounting: <NameForm key={resetCount} initial={…} />
export {};
