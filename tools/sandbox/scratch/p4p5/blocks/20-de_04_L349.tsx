// packages/design-system/src/components/Dialog/Dialog.tsx
import * as RadixDialog from "@radix-ui/react-dialog";  // ⚠ package names/versions: verify
import type { ReactNode } from "react";
import styles from "./Dialog.module.css";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;                // required: dialogs must have an accessible name
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content className={styles.content}>
          <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
          {description ? (
            <RadixDialog.Description className={styles.description}>{description}</RadixDialog.Description>
          ) : null}
          <div className={styles.body}>{children}</div>
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
export {};
