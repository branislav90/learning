// use-disclosure.ts
import { useId, useState, type ComponentProps } from "react";

export function useDisclosure(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  const getButtonProps = (props: ComponentProps<"button"> = {}): ComponentProps<"button"> => ({
    type: "button",
    "aria-expanded": open,
    "aria-controls": contentId,
    ...props,
    onClick: (e) => {
      props.onClick?.(e);
      if (!e.defaultPrevented) setOpen((o) => !o);
    },
  });

  const getContentProps = (props: ComponentProps<"div"> = {}): ComponentProps<"div"> => ({
    id: contentId,
    hidden: !open,
    ...props,
  });

  return { open, getButtonProps, getContentProps };
}
export {};
