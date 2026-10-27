import { useState, type ChangeEvent, type ReactNode } from "react";

type CounterProps = {
  label: string;
  initial?: number;
  step?: number;
  children?: ReactNode;
};

function Counter({ label, initial = 0, step = 1, children }: CounterProps) {
  const [count, setCount] = useState<number>(initial);
  return (
    <section aria-label={label}>
      <h2>{label}: {count}</h2>
      <button type="button" onClick={() => setCount(c => c + step)}>+{step}</button>
      {children}
    </section>
  );
}

export default function App() {
  const [name, setName] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  return (
    <main>
      <h1>Hello{name ? `, ${name}` : ""}!</h1>
      <label>
        Your name <input value={name} onChange={handleChange} />
      </label>
      <Counter label="Clicks" step="2">
        <p>Step is 2.</p>
      </Counter>
    </main>
  );
}
