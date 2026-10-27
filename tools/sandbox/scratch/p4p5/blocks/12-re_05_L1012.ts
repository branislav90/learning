type State = { step: 1 | 2 | 3; data: Data; errors: Readonly<Record<string, string>>; status: "editing" | "submitting" | "done" };
type Action =
  | { type: "fieldChanged"; name: keyof Data; value: string }
  | { type: "nextRequested" }
  | { type: "backRequested" }
  | { type: "submitStarted" }
  | { type: "submitSucceeded" }
  | { type: "submitFailed"; errors: Record<string, string> };

function wizardReducer(s: State, a: Action): State {
  switch (a.type) {
    case "fieldChanged": {
      const { [a.name as string]: _removed, ...rest } = s.errors;      // clear this field's error
      return { ...s, data: { ...s.data, [a.name]: a.value }, errors: rest };
    }
    case "nextRequested": {
      const errors = validateStep(s.step, s.data);                    // pure function
      return Object.keys(errors).length > 0 ? { ...s, errors } : { ...s, errors: {}, step: Math.min(3, s.step + 1) as State["step"] };
    }
    case "backRequested": return s.step > 1 ? { ...s, step: (s.step - 1) as State["step"] } : s;
    case "submitStarted": return s.status === "editing" ? { ...s, status: "submitting" } : s;
    case "submitSucceeded": return s.status === "submitting" ? { ...s, status: "done" } : s;
    case "submitFailed": return s.status === "submitting" ? { ...s, status: "editing", errors: a.errors } : s;
    default: return assertNever(a);
  }
}
export {};
