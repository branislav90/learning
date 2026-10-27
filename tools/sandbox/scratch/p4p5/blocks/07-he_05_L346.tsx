// primitives.tsx
import type { ComponentProps } from "react";
import { Slot } from "./slot";

type TriggerProps = ComponentProps<"button"> & { asChild?: boolean };

export function DisclosureTrigger({ asChild, ...rest }: TriggerProps) {
  // useDisclosureContext: guard hook over the root's context, as in Lesson 05 §5.1 (not shown)
  const d = useDisclosureContext("Disclosure.Trigger");
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...(asChild ? {} : { type: "button" as const })}
      aria-expanded={d.open}
      aria-controls={d.contentId}
      onClick={d.toggle}
      {...rest}
    />
  );
}
export {};
