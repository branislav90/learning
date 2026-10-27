// Card.tsx
import styles from "./Card.module.css";
export function Card({ tone = "default", children }: { tone?: "default" | "warning"; children: React.ReactNode }) {
  return <section className={styles.root} data-tone={tone}>{children}</section>;
}
export {};
