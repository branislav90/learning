// @vitest-environment jsdom
import { test } from 'vitest';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { render, cleanup } from '@testing-library/react';
const useS = create<{ items: number[] }>(() => ({ items: [1, 2, 3] }));
function Bad() { const x = useS((s) => s.items.map(i => i * 2)); return <>{x.length}</>; }
function Good() { const x = useS(useShallow((s) => s.items.map(i => i * 2))); return <>{x.length}</>; }
test('z', () => {
  const orig = console.error; const errs: string[] = []; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 120));
  try { render(<Bad />); console.log('bad: rendered ok'); } catch (e: any) { console.log('bad threw:', String(e.message).slice(0, 100)); }
  cleanup();
  try { render(<Good />); console.log('good: ok'); } catch (e: any) { console.log('good threw', e.message); }
  console.error = orig; console.log(errs.slice(0, 3));
});
