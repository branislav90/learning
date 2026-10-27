// src/form/hooks/useSubmit.ts
import { useEffect, useRef } from "react";
import { useForm, useFormDispatch } from "../FormProvider";
import { useOnboardingApi } from "../../api/ApiContext";
import { firstInvalidStep } from "../validation/steps";
import { toPayload } from "../payload";

export function useSubmit() {
  const state = useForm();
  const dispatch = useFormDispatch();
  const api = useOnboardingApi();
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => () => inFlight.current?.abort(), []); // abort on unmount

  return async function submit() {
    if (inFlight.current !== null) return; // handler-level guard: survives double click/Enter in the same tick
    const invalidStep = firstInvalidStep(state.values, state.registration);
    if (invalidStep !== null) {
      dispatch({ type: "step/blocked", step: invalidStep });
      return;
    }

    const controller = new AbortController();
    inFlight.current = controller;
    dispatch({ type: "submit/started" });
    try {
      const result = await api.submitApplication(toPayload(state.values, state.idempotencyKey), controller.signal);
      if (controller.signal.aborted) return;
      if (result.ok) {
        dispatch({ type: "submit/succeeded", reference: result.reference });
      } else {
        dispatch({ type: "submit/failed", kind: "validation", message: result.message, serverErrors: result.serverErrors });
        // Take the user to the first step that has a server error (mapping function is yours to write).
      }
    } catch {
      if (controller.signal.aborted) return;
      dispatch({ type: "submit/failed", kind: "network", message: "We could not reach the server. Your answers are saved; try again." });
    } finally {
      inFlight.current = null;
    }
  };
}
