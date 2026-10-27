// checkout-machine.ts
export type CheckoutState =
  | { status: 'idle' }
  | { status: 'submitting'; attempt: number }
  | { status: 'failure'; attempt: number; message: string }
  | { status: 'success'; receiptId: string };

export type CheckoutEvent =
  | { type: 'SUBMIT' }
  | { type: 'RESOLVE'; receiptId: string }
  | { type: 'REJECT'; message: string }
  | { type: 'RETRY' }
  | { type: 'RESET' };

export const initialCheckoutState: CheckoutState = { status: 'idle' };

export const MAX_ATTEMPTS = 3;

export function checkoutReducer(state: CheckoutState, event: CheckoutEvent): CheckoutState {
  switch (state.status) {
    case 'idle':
      return event.type === 'SUBMIT' ? { status: 'submitting', attempt: 1 } : state;

    case 'submitting':
      switch (event.type) {
        case 'RESOLVE':
          return { status: 'success', receiptId: event.receiptId };
        case 'REJECT':
          return { status: 'failure', attempt: state.attempt, message: event.message };
        default:
          return state; // SUBMIT / RETRY / RESET while in flight: ignored
      }

    case 'failure':
      if (event.type === 'RETRY' && state.attempt < MAX_ATTEMPTS) {   // guard
        return { status: 'submitting', attempt: state.attempt + 1 };
      }
      return event.type === 'RESET' ? initialCheckoutState : state;

    case 'success':
      return event.type === 'RESET' ? initialCheckoutState : state;

    default: {
      const unreachable: never = state;   // compile error if a status is unhandled
      return unreachable;
    }
  }
}
export {};
