// use-tabs.ts
import { useId, useRef } from 'react';
import type { HTMLAttributes, KeyboardEvent, ButtonHTMLAttributes } from 'react';
import { composeHandlers } from './compose';
import { useControllableState } from './use-controllable-state';

export function useTabs<K extends string>(keys: readonly K[], opts: { value?: K; defaultValue: K; onValueChange?: (k: K) => void }) {
  const [value, setValue] = useControllableState<K>({ value: opts.value, defaultValue: opts.defaultValue, onChange: opts.onValueChange });
  const base = useId();
  const tabRefs = useRef(new Map<K, HTMLButtonElement | null>());

  const focusKey = (k: K) => tabRefs.current.get(k)?.focus();

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const i = keys.indexOf(value);
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (i + 1) % keys.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + keys.length) % keys.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = keys.length - 1;
    if (next === null) return;
    e.preventDefault();
    const k = keys[next];
    setValue(k);           // "automatic activation": selection follows focus (see note)
    focusKey(k);
  };

  const getTabListProps = (p: HTMLAttributes<HTMLDivElement> = {}): HTMLAttributes<HTMLDivElement> => ({
    ...p,
    role: 'tablist',
    onKeyDown: composeHandlers(p.onKeyDown, onKeyDown),
  });

  const getTabProps = (k: K, p: ButtonHTMLAttributes<HTMLButtonElement> = {}): ButtonHTMLAttributes<HTMLButtonElement> & { ref: (n: HTMLButtonElement | null) => void } => ({
    ...p,
    id: `${base}-tab-${k}`,
    role: 'tab',
    type: 'button',
    'aria-selected': value === k,
    'aria-controls': `${base}-panel-${k}`,
    tabIndex: value === k ? 0 : -1,             // roving tabindex: only the selected tab is in the tab order
    'data-state': value === k ? 'active' : 'inactive',
    onClick: () => setValue(k),
    ref: (n) => { tabRefs.current.set(k, n); },
  });

  const getPanelProps = (k: K, p: HTMLAttributes<HTMLDivElement> = {}): HTMLAttributes<HTMLDivElement> => ({
    ...p,
    id: `${base}-panel-${k}`,
    role: 'tabpanel',
    'aria-labelledby': `${base}-tab-${k}`,
    hidden: value !== k,
    tabIndex: 0,
  });

  return { value, setValue, getTabListProps, getTabProps, getPanelProps };
}
export {};
