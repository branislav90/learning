// disputes/wizard-machine.ts  (pure)
export type Step = "reason" | "evidence" | "review" | "submitted";
export interface WizardState { step: Step; draft: DisputeDraft }
export type WizardEvent =
  | { type: "reason-chosen"; reason: Reason }
  | { type: "evidence-added"; file: { name: string; sizeBytes: number } }
  | { type: "back" }
  | { type: "next" }
  | { type: "submitted" };

export function wizardReducer(state: WizardState, event: WizardEvent): WizardState {
  switch (event.type) {
    case "reason-chosen":
      return { ...state, draft: { ...state.draft, reason: event.reason } };
    case "evidence-added":
      return { ...state, draft: addEvidence(state.draft, event.file) };      // delegates to domain (lesson 08)
    case "next": {
      if (state.step === "reason" && !state.draft.reason) return state;       // guard
      if (state.step === "review" && validate(state.draft).length > 0) return state;
      const order: Step[] = ["reason", "evidence", "review"];
      const i = order.indexOf(state.step as Exclude<Step, "submitted">);
      return i >= 0 && i < order.length - 1 ? { ...state, step: order[i + 1] } : state;
    }
    case "back": {
      const order: Step[] = ["reason", "evidence", "review"];
      const i = order.indexOf(state.step);
      return i > 0 ? { ...state, step: order[i - 1] } : state;
    }
    case "submitted":
      return { ...state, step: "submitted" };
  }
}
export {};
