import { useEffect, useRef, useState } from 'react';
export function A() {
  useEffect(async () => { await 1; }, []);   // expect error
  let inst: HTMLDivElement | null = null;
  const bad = <div ref={(el) => (inst = el)} />;   // expect error in 19 types
  const good = <div ref={(el) => { inst = el; }} />;
  const r = useRef<number>(0); r.current = 3;       // mutable?
  const r2 = useRef<HTMLDivElement>(null); r2.current = null; // ok?
  const [s, set] = useState<(a: number) => number>(() => (a) => a);
  set(() => (a) => a + 1);
  return <>{bad}{good}</>;
}
