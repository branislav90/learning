import React, { memo, useEffect, useState } from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
const logs: string[] = []; const clog = (m: string) => logs.push(m);
export type Item = { id: string; label: string };

export type KeyMode = "id" | "index" | "random" | "none";

const Row = memo(function Row({ item }: { item: Item }) {
  // State captured at MOUNT. It never changes for the life of this component instance.
  const [mountedAs] = useState(item.label);

  useEffect(() => {
    clog(`mount   instance#${mountedAs}`);
    return () => clog(`unmount instance#${mountedAs}`);
  }, [mountedAs]);

  clog(`render  Row for item ${item.label} (instance#${mountedAs})`);
  return (
    <li data-id={item.id}>
      <span className="label">{item.label}</span>{" "}
      <small>(instance mounted as {mountedAs})</small>{" "}
      <input defaultValue="" aria-label={`note for ${item.label}`} />
    </li>
  );
});

export function List({ initial, mode }: { initial: Item[]; mode: KeyMode }) {
  const [items, setItems] = useState(initial);
  return (
    <>
      <button onClick={() => setItems((xs) => [...xs].reverse())}>Reverse</button>
      <button onClick={() => setItems((xs) => [{ id: "N", label: "N" }, ...xs])}>Insert at head</button>
      <button onClick={() => setItems((xs) => xs.filter((x) => x.id !== "B"))}>Delete B</button>
      <ul>
        {items.map((item, i) => {
          switch (mode) {
            case "id":
              return <Row key={item.id} item={item} />;
            case "index":
              return <Row key={i} item={item} />;
            case "random":
              return <Row key={Math.random()} item={item} />; // ❌ anti-pattern, shown for study
            case "none":
              return <Row item={item} />;                       // ❌ warns; behaves like index keys
          }
        })}
      </ul>
    </>
  );
}

const base = [{id:"A",label:"A"},{id:"B",label:"B"},{id:"C",label:"C"},{id:"D",label:"D"}];
async function run(mode: KeyMode, action: string) {
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 60));
  const r = render(<List initial={base} mode={mode} />);
  const inputs = r.container.querySelectorAll('input'); inputs.forEach((inp, i) => { (inp as HTMLInputElement).value = 'abcd'[i]; });
  logs.length = 0;
  let buf: MutationRecord[] = []; const mo = new MutationObserver(l => buf.push(...l)); mo.observe(r.container.querySelector('ul')!, { subtree: true, childList: true, attributes: true, characterData: true });
  const btn = [...r.container.querySelectorAll('button')].find(b => b.textContent === action)!;
  await userEvent.click(btn); await act(async () => {}); buf.push(...mo.takeRecords());
  const moved = new Set<string>(); let rem = 0, add = 0;
  buf.forEach(x => { if (x.type === 'childList') { x.removedNodes.forEach(n => { rem++; }); x.addedNodes.forEach(n => { add++; }); } });
  const texts = [...r.container.querySelectorAll('li')].map(li => (li.querySelector('.label')!.textContent + ':' + (li.querySelector('input') as HTMLInputElement).value + ':' + li.querySelector('small')!.textContent!.replace('(instance mounted as ','').replace(')','')));
  if (mode==='index' && action==='Reverse') console.log('DETAIL', buf.map(x => x.type + ':' + (x.attributeName||'') + ':' + (x.target as any).nodeName));
  console.log(mode.padEnd(6), action.padEnd(14), 'records:', buf.length, 'childList removed/added', rem, add, '| Row calls', logs.filter(l => l.startsWith('render')).length, '| mount/unmount', logs.filter(l => l.startsWith('mount')).length + '/' + logs.filter(l => l.startsWith('unmount')).length, '| DOM:', texts.join(' '), errs.length ? '| console.error: ' + errs[0] : '');
  console.error = o; r.unmount();
}
test('modes', async () => {
  for (const mode of ['id', 'index', 'random', 'none'] as KeyMode[]) for (const a of ['Reverse', 'Insert at head', 'Delete B']) await run(mode, a);
});
