import { type ComponentProps, type MouseEvent } from "react";
import { useControllableState } from "./use-controllable-state";

export function useToggleButton({ pressed, defaultPressed = false, onPressedChange }: {
  pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (p: boolean) => void;
}) {
  const [isPressed, setPressed] = useControllableState<boolean>({
    value: pressed, defaultValue: defaultPressed, onChange: onPressedChange,
  });
  function getButtonProps(props: ComponentProps<"button"> = {}): ComponentProps<"button"> {
    return {
      type: "button",
      "aria-pressed": isPressed,
      ...props,
      onClick: (e: MouseEvent<HTMLButtonElement>) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) setPressed(!isPressed);
      },
    };
  }
  return { pressed: isPressed, getButtonProps };
}
export {};
