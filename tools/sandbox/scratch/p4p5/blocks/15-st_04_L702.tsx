function Wizard({ step }: { step: number }) {
  const [current, setCurrent] = useState(step);
  return <button onClick={() => setCurrent((c) => c + 1)}>{current}</button>;
}
export {};
