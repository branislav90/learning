// src/form/validation/billing.ts
import type { BillingValues } from "../types";
import { firstError, required } from "./rules";
import { isValidIban } from "./rules";
import { stripUndefined, type Errors } from "./vehicle";

export function validateBilling(b: BillingValues): Errors<BillingValues> {
  return stripUndefined({
    method: b.method === "" ? "Choose a payment method." : undefined,
    // Conditional: only when direct debit is chosen.
    iban:
      b.method === "direct-debit"
        ? firstError(
            b.iban,
            required("Enter the IBAN."),
            (v) => (isValidIban(v) ? undefined : "This IBAN is not valid. Check for typos."),
          )
        : undefined,
    // Conditional: only when the address differs from the company's.
    billingAddress: b.sameAsCompany ? undefined : firstError(b.billingAddress, required("Enter the billing address.")),
  });
}
