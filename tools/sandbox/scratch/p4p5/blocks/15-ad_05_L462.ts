// domain/payment.ts — the interface the app owns
export interface PaymentRequest { amountMinor: number; currency: string; orderId: string }
export type PaymentResult =
  | { status: 'succeeded'; receiptId: string }
  | { status: 'requires_action'; actionUrl: string }
  | { status: 'failed'; reason: string };

export interface PaymentGateway {
  readonly id: string;
  pay(req: PaymentRequest, signal?: AbortSignal): Promise<PaymentResult>;
}
export {};
