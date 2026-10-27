// use-disclosure.ts
import { useCallback, useId, useMemo } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, MouseEvent, Ref } from 'react';
import { composeHandlers } from './compose';
import { useControllableState } from './use-controllable-state';

type DisclosureOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type TriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> };
type PanelProps = HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> };

export function useDisclosure({ open: openProp, defaultOpen = false, onOpenChange }: DisclosureOptions = {}) {
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);

  const getTriggerProps = useCallback(
    (props: TriggerProps = {}): TriggerProps & { 'data-state': 'open' | 'closed' } => ({
      ...props,
      id: triggerId,
      type: 'button',
      'aria-expanded': open,
      'aria-controls': panelId,
      'data-state': open ? 'open' : 'closed',
      onClick: composeHandlers<MouseEvent<HTMLButtonElement>>(props.onClick, toggle),
    }),
    [open, panelId, toggle, triggerId],
  );

  const getPanelProps = useCallback(
    (props: PanelProps = {}): PanelProps & { 'data-state': 'open' | 'closed' } => ({
      ...props,
      id: panelId,
      role: props.role ?? 'region',      // default, overridable by the consumer
      'aria-labelledby': triggerId,
      hidden: !open,
      'data-state': open ? 'open' : 'closed',
      onKeyDown: composeHandlers<KeyboardEvent<HTMLElement>>(props.onKeyDown, (e) => {
        if (e.key === 'Escape') { e.stopPropagation(); close(); }
      }),
    }),
    [close, open, panelId, triggerId],
  );

  return useMemo(
    () => ({ open, setOpen, toggle, close, getTriggerProps, getPanelProps }),
    [open, setOpen, toggle, close, getTriggerProps, getPanelProps],
  );
}
export {};
