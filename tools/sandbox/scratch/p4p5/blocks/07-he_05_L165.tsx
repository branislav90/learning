// use-listbox.ts
import { useId, useState, type HTMLAttributes, type KeyboardEvent, type MouseEvent } from "react";
import { useControllableState } from "./use-controllable-state"; // Lesson 06 §5.5

type Options<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  /** Controlled selection. `undefined` means uncontrolled. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (key: string | null) => void;
};

export function useListbox<T>({ items, getKey, value, defaultValue = null, onValueChange }: Options<T>) {
  const [selectedKey, setSelectedKey] = useControllableState<string | null>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [rawActive, setActive] = useState(0);
  const baseId = useId();

  // Derived, not stored: the list may shrink between renders.
  const lastIndex = items.length - 1;
  const activeIndex = Math.max(0, Math.min(rawActive, lastIndex));
  const optionId = (index: number) => `${baseId}-option-${index}`;

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (items.length === 0) return;
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setActive(Math.min(activeIndex + 1, lastIndex)); break;
      case "ArrowUp":   e.preventDefault(); setActive(Math.max(activeIndex - 1, 0)); break;
      case "Home":      e.preventDefault(); setActive(0); break;
      case "End":       e.preventDefault(); setActive(lastIndex); break;
      case "Enter":
      case " ":         e.preventDefault(); setSelectedKey(getKey(items[activeIndex])); break;
    }
  }

  function getListboxProps(props: HTMLAttributes<HTMLElement> = {}): HTMLAttributes<HTMLElement> {
    return {
      role: "listbox",
      tabIndex: 0,
      "aria-activedescendant": items.length > 0 ? optionId(activeIndex) : undefined,
      ...props,
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        props.onKeyDown?.(e);
        if (!e.defaultPrevented) handleKeyDown(e);
      },
    };
  }

  function getOptionProps(
    index: number,
    props: HTMLAttributes<HTMLElement> = {},
  ): HTMLAttributes<HTMLElement> & { "data-active"?: true } {
    return {
      role: "option",
      id: optionId(index),
      "aria-selected": getKey(items[index]) === selectedKey,
      "data-active": index === activeIndex || undefined,
      ...props,
      onClick: (e: MouseEvent<HTMLElement>) => {
        props.onClick?.(e);
        if (e.defaultPrevented) return;
        setActive(index);
        setSelectedKey(getKey(items[index]));
      },
    };
  }

  return { selectedKey, activeIndex, getListboxProps, getOptionProps };
}
export {};
