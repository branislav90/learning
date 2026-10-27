import type { ReactNode } from "react";

type CardProps = {
  header?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode; // the default slot
};

export function Card({ header, actions, footer, children }: CardProps) {
  return (
    <section className="card">
      {(header != null || actions != null) && (
        <header className="card__header">
          <div className="card__title">{header}</div>
          {actions != null && <div className="card__actions">{actions}</div>}
        </header>
      )}
      <div className="card__body">{children}</div>
      {footer != null && <footer className="card__footer">{footer}</footer>}
    </section>
  );
}
export {};
