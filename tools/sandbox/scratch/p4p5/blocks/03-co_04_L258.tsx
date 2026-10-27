import type { ReactNode } from "react";

interface CardProps { variant?: "default" | "highlighted"; density?: "comfortable" | "compact"; children: ReactNode }

export function Card({ variant = "default", density = "comfortable", children }: CardProps) {
  return <article data-variant={variant} data-density={density} className="card">{children}</article>;
}
Card.Header = function CardHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  return <header>{icon}<h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</header>;
};
Card.Body = function CardBody({ children }: { children: ReactNode }) { return <div>{children}</div>; };
Card.Footer = function CardFooter({ children }: { children: ReactNode }) { return <footer>{children}</footer>; };
export {};
