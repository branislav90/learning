import type { ReactNode } from "react";

type NewProps = { open: boolean; onOpenChange: (open: boolean) => void };
type LegacyProps = { visible: boolean; onClose: () => void };
type ModalProps = (NewProps | LegacyProps) & { children: ReactNode };

function isLegacy(p: ModalProps): p is LegacyProps & { children: ReactNode } {
  return "visible" in p;
}

export function Modal(props: ModalProps) {
  if (isLegacy(props) && process.env.NODE_ENV !== "production") {
    console.warn("<Modal visible/onClose> is deprecated; use open/onOpenChange (see docs).");
  }
  const open = isLegacy(props) ? props.visible : props.open;
  const requestClose = () => (isLegacy(props) ? props.onClose() : props.onOpenChange(false));
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true">
      <button onClick={requestClose} aria-label="Close">×</button>
      {props.children}
    </div>
  );
}
export {};
