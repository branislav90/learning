// src/ui/Wizard.tsx (excerpt)
import { useEffect, useRef } from "react";
import { collectStepErrors } from "../form/validation/steps";
import { useForm, useFormDispatch } from "../form/FormProvider";
import { ErrorSummary } from "./ErrorSummary";

export function Wizard() {
  const state = useForm();
  const dispatch = useFormDispatch();
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Derived: summary shows only after a failed attempt on THIS step.
  const items = state.attempted[state.step]
    ? collectStepErrors(state.values, state.step, state.registration)
    : [];

  // Focus the summary when a failed attempt happens. Event-driven: track the attempt count via a ref
  // or compare previous `attempted` to avoid stealing focus on every keystroke.
  const attemptedThisStep = state.attempted[state.step];
  const prevAttempted = useRef(false);
  useEffect(() => {
    if (attemptedThisStep && !prevAttempted.current) summaryRef.current?.focus();
    prevAttempted.current = attemptedThisStep;
  }, [attemptedThisStep]);

  // On step change, move focus to the step heading.
  useEffect(() => {
    headingRef.current?.focus();
  }, [state.step]);
  /* ... render StepIndicator, <h2 ref={headingRef} tabIndex={-1}>, ErrorSummary, current step, Back/Next */
}
