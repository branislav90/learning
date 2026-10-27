// src/form/hooks/useRegistrationCheck.ts
import { useEffect } from "react";
import { useFormDispatch } from "../FormProvider";
import { useOnboardingApi } from "../../api/ApiContext";

const DEBOUNCE_MS = 400;

export function useRegistrationCheck(value: string, syncError: string | undefined): void {
  const dispatch = useFormDispatch();
  const api = useOnboardingApi();

  useEffect(() => {
    if (value === "" || syncError !== undefined) return; // only check syntactically valid values

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      dispatch({ type: "registration/checking", value });
      try {
        const available = await api.isRegistrationAvailable(value, controller.signal);
        dispatch({ type: "registration/checked", value, result: available ? "available" : "taken" });
      } catch {
        if (controller.signal.aborted) return; // superseded: say nothing
        dispatch({ type: "registration/checked", value, result: "error" });
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer); // cancel pending debounce
      controller.abort(); // cancel in-flight request
    };
  }, [value, syncError, api, dispatch]);
}
