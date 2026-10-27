import styles from "./Badge.module.css";

type Tone = "neutral" | "success" | "danger";
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={styles.root} data-tone={tone}>{children}</span>;
}
export {};
