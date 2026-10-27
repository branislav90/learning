import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();     // top layer, inert background, focus moves in
    if (!open && dialog.open) dialog.close();         // browser restores focus to the previously focused element*
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}                 // fires when dialog closes via Esc or form method=dialog
      onCancel={() => { /* Esc pressed: allow default close; hook for "unsaved changes?" guards */ }}
    >
      <h2 id={titleId}>{title}</h2>
      {children}
      <form method="dialog">
        <button type="submit">Close</button>
      </form>
    </dialog>
  );
}
