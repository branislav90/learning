export const flagRegistry = {
  "cards.new-limit-editor": { owner: "cards-team", default: false, expires: "2027-03-01" },
  "billing.invoice-v2": { owner: "billing-team", default: false, expires: "2027-01-15" },
} as const;
export type FlagKey = keyof typeof flagRegistry;
export {};
