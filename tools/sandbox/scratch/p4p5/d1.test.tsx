// @vitest-environment jsdom
import { test } from 'vitest';
import React, { act, useRef, cloneElement } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('D1', async () => {
  const tracks: string[] = []; const track = (s: string) => tracks.push(s);
  function Slot({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactElement<any> }) { return cloneElement(children, props); }
  function Button({ asChild, ...props }: { asChild?: boolean } & React.ComponentProps<'button'>) { const Comp: any = asChild ? Slot : 'button'; return <Comp className="btn" onClick={() => track('button')} {...props} />; }
  let br: any, lr: any;
  function App() { br = useRef<HTMLButtonElement>(null); lr = useRef<HTMLAnchorElement>(null); return <Button asChild ref={br}><a href="#pay" onClick={() => track('link')} ref={lr}>Pay</a></Button>; }
  const host = document.createElement('div'); document.body.append(host);
  await act(async () => createRoot(host).render(<App />));
  await act(async () => { host.querySelector('a')!.click(); });
  console.log('D1 tracks', tracks, 'buttonRef', br.current?.tagName, 'linkRef', lr.current);
});
