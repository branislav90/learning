// adapters/acmePay.ts — ADAPTER: vendor SDK (hypothetical) -> PaymentGateway
import type { AcmeClient } from 'acme-pay-sdk'; // hypothetical

export function acmeAdapter(client: AcmeClient): PaymentGateway {
  return {
    id: 'acme',
    async pay(req, signal) {
      try {
        const r = await client.charges.create(
          { cents: req.amountMinor, cur: req.currency.toLowerCase(), ref: req.orderId },
          { signal },
        );
        if (r.state === 'OK') return { status: 'succeeded', receiptId: r.rcpt };
        if (r.state === '3DS') return { status: 'requires_action', actionUrl: r.redirect };
        return { status: 'failed', reason: r.err_msg ?? 'declined' };
      } catch (e) {
        if (signal?.aborted) throw e;                  // let cancellation propagate
        return { status: 'failed', reason: 'network' };
      }
    },
  };
}
export {};
