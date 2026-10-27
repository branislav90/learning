export {};
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

type NoMessage = DistributiveOmit<AlertProps, "message">;
// { variant: "info" } | { variant: "error"; onRetry: () => void } | { variant: "confirm"; onConfirm…; onCancel… }
type Broken = Omit<AlertProps, "message">;
// { variant: "info" | "error" | "confirm" }   — only common keys survive; variant-specific props are lost
