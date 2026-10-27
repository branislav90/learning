import { createContext, use, useId, useState, type ComponentProps, type ReactNode } from "react";

type Ctx = { open: boolean; toggle: () => void; contentId: string };
const DisclosureCtx = createContext<Ctx | null>(null);
function useDisclosure(part: string) {
  const c = use(DisclosureCtx);
  if (!c) throw new Error(`<${part}> must be inside <Disclosure>`);
  return c;
}

type Props = { open?: boolean; defaultOpen?: boolean; onOpenChange?: (o: boolean) => void; children: ReactNode };
export function Disclosure({ open: controlled, defaultOpen = false, onOpenChange, children }: Props) {
  const [internal, setInternal] = useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled : internal;
  const contentId = useId();
  const toggle = () => {
    const next = !open;
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };
  return <DisclosureCtx value={{ open, toggle, contentId }}>{children}</DisclosureCtx>;
}

export function DisclosureButton(props: ComponentProps<"button">) {
  const d = useDisclosure("Disclosure.Button");
  return <button type="button" aria-expanded={d.open} aria-controls={d.contentId} onClick={d.toggle} {...props} />;
}

export function DisclosureContent(props: ComponentProps<"div">) {
  const d = useDisclosure("Disclosure.Content");
  return <div id={d.contentId} hidden={!d.open} {...props} />;
}
export {};
