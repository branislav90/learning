import { useState } from "react";

function Counter({ person }: { person: string }) {
  const [score, setScore] = useState(0);
  return (
    <div>
      <h3>{person}: {score}</h3>
      <button onClick={() => setScore(score + 1)}>+1</button>
    </div>
  );
}

export function Scoreboard() {
  const [isAlice, setIsAlice] = useState(true);
  return (
    <>
      {isAlice ? <Counter person="Alice" /> : <Counter person="Bob" />}
      <button onClick={() => setIsAlice(!isAlice)}>Switch player</button>
    </>
  );
}
