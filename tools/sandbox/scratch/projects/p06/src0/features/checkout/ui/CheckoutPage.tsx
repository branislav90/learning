import { useActionState, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ApiError } from '../../../shared/api/http'
import { cartKeys } from '../../cart/api/queries'
import { catalogKeys } from '../../catalog/api/queries'
import { checkoutApi, checkoutSchema, emptyCart, orderKeys } from '../../../stubs'
type CheckoutState = { status: 'idle' } | { status: 'invalid'; errors: Record<string, string[] | undefined> } | { status: 'success'; orderId: string } | { status: 'error'; message: string; retryable: boolean }
function SubmitButton() { return <button>go</button> }

// features/checkout/ui/CheckoutPage.tsx
function CheckoutForm({ userId }: { userId: string }) {
  const qc = useQueryClient()
  const idempotencyKey = useRef<string | null>(null)
  idempotencyKey.current ??= crypto.randomUUID()

  const [state, submit, isPending] = useActionState(
    async (_prev: CheckoutState, formData: FormData): Promise<CheckoutState> => {
      const parsed = checkoutSchema.safeParse(Object.fromEntries(formData))
      if (!parsed.success) return { status: 'invalid', errors: parsed.error.flatten().fieldErrors }
      try {
        const order = await checkoutApi.placeOrder(parsed.data, idempotencyKey.current ?? crypto.randomUUID())
        // Cache policy after success:
        qc.setQueryData(cartKeys.cart(userId), emptyCart())             // known outcome: write
        qc.setQueryData(orderKeys.detail(order.id), order)               // seed detail
        void qc.invalidateQueries({ queryKey: orderKeys.list(userId) })  // list membership: refetch
        void qc.invalidateQueries({ queryKey: catalogKeys.details() })   // stock changed: refetch lazily
        idempotencyKey.current = crypto.randomUUID()                      // next order, next key
        return { status: 'success', orderId: order.id }
      } catch (e) {
        return { status: 'error', message: e instanceof ApiError ? e.message : 'Payment failed', retryable: !(e instanceof ApiError) || e.retryable }
      }
    },
    { status: 'idle' },
  )

  return (
    <form action={submit} noValidate>
      {/* fields with aria-describedby to state.errors */}
      <SubmitButton /> {/* uses useFormStatus() */}
      <p role="status">{state.status === 'error' && state.message}</p>
    </form>
  )
}
