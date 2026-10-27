import { createContext, use, useId, type ReactNode } from "react";

type DialogCtx = { titleId: string; descriptionId: string };
const DialogContext = createContext<DialogCtx | null>(null);

function useDialog(part: string): DialogCtx {
  const ctx = use(DialogContext);
  if (!ctx) throw new Error(`<Dialog.${part}> must be used inside <Dialog>`);
  return ctx;
}

function Dialog({ children, open }: { children: ReactNode; open: boolean }) {
  const titleId = useId();
  const descriptionId = useId();
  if (!open) return null;
  return (
    <DialogContext value={{ titleId, descriptionId }}>
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
        {children}
      </div>
    </DialogContext>
  );
}

function Title({ children }: { children: ReactNode }) {
  const { titleId } = useDialog("Title");
  return <h2 id={titleId}>{children}</h2>;
}

function Description({ children }: { children: ReactNode }) {
  const { descriptionId } = useDialog("Description");
  return <p id={descriptionId}>{children}</p>;
}

function Actions({ children }: { children: ReactNode }) {
  useDialog("Actions");
  return <div className="dialog__actions">{children}</div>;
}

Dialog.Title = Title;
Dialog.Description = Description;
Dialog.Actions = Actions;
export { Dialog };
export {};
