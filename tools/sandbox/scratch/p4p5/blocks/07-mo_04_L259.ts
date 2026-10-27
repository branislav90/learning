// modules/notifications/internal/types.ts
export type NotificationLevel = "info" | "success" | "error";
export interface NotificationInput {
  readonly level: NotificationLevel;
  readonly message: string;
  readonly timeoutMs?: number;
}
export interface Notifier {
  notify(input: NotificationInput): void;
}
export {};
