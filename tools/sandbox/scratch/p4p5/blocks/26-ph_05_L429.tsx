import { useCallback, useEffect, useRef, useState } from "react";

export function useControllableState<T>({
  prop, defaultProp, onChange,
}: { prop: T | undefined; defaultProp: T; onChange?: (v: T) => void }) {
  const [inner, setInner] = useState<T>(defaultProp);
  const isControlled = prop !== undefined;
  const value = (isControlled ? prop : inner) as T;

  const wasControlled = useRef(isControlled);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && wasControlled.current !== isControlled) {
      console.warn(
        `A component changed from ${wasControlled.current ? "controlled" : "uncontrolled"} to ` +
        `${isControlled ? "controlled" : "uncontrolled"}. Decide for the component's lifetime.`,
      );
    }
    wasControlled.current = isControlled;
  }, [isControlled]);

  const setValue = useCallback((next: T) => {
    if (!isControlled) setInner(next);
    if (!Object.is(next, value)) onChange?.(next);
  }, [isControlled, value, onChange]);

  return [value, setValue] as const;
}

type SwitchProps = Omit<React.ComponentPropsWithoutRef<"button">, "onChange" | "role" | "aria-checked"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({ checked, defaultChecked = false, onCheckedChange, onClick, ...rest }: SwitchProps) {
  const [on, setOn] = useControllableState({ prop: checked, defaultProp: defaultChecked, onChange: onCheckedChange });
  return (
    <button
      type="button"
      {...rest}
      role="switch"
      aria-checked={on}
      data-state={on ? "on" : "off"}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) setOn(!on); }}
    />
  );
}
export {};
