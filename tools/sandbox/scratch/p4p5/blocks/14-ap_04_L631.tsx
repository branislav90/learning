// features/orders/ui/PlaceOrderForm.tsx — React 19 Action + DAL command
import { useActionState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { placeOrder } from "../api/commands";
import { orderKeys } from "../api/queries";
import { isApiException } from "@/platform/http";

type FormState =
  | { status: "idle" }
  | { status: "success"; orderId: string }
  | { status: "error"; fieldErrors: Record<string, readonly string[]>; message?: string };

export function PlaceOrderForm({ cartId, addressId }: { cartId: string; addressId: string }) {
  const qc = useQueryClient();

  const [state, action, pending] = useActionState<FormState, FormData>(async (_prev, fd) => {
    const giftNote = String(fd.get("giftNote") ?? "").trim() || undefined;
    try {
      const order = await placeOrder(
        { cartId, shippingAddressId: addressId, giftNote },
        { idempotencyKey: String(fd.get("idempotencyKey")) },     // generated once per form instance, see below
      );
      await qc.invalidateQueries({ queryKey: orderKeys.lists() });
      return { status: "success", orderId: order.id };
    } catch (e) {
      if (isApiException(e) && e.error.kind === "validation") {
        return { status: "error", fieldErrors: e.error.fieldErrors };
      }
      return { status: "error", fieldErrors: {}, message: "Could not place the order. Please try again." };
    }
  }, { status: "idle" });

  return (
    <form action={action}>
      <input type="hidden" name="idempotencyKey" defaultValue={crypto.randomUUID()} />
      <label>Gift note <input name="giftNote" maxLength={200} /></label>
      {state.status === "error" && state.fieldErrors.gift_note?.map((m) => <p key={m} role="alert">{m}</p>)}
      <button disabled={pending}>Place order</button>
    </form>
  );
}
export {};
