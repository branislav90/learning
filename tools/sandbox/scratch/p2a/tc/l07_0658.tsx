import { Fragment, type ReactNode } from "react";
export function ResetOnChange({ resetKey, children }: { resetKey: string | number; children: ReactNode }) {
  return <Fragment key={resetKey}>{children}</Fragment>;
}
