// src/form/FormProvider.tsx
import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import { formReducer } from "./reducer";
import { createInitialState } from "./initialState";
import { clearDraft, loadDraft, saveDraft } from "./draft";
import type { FormAction, FormState } from "./types";

const StateContext = createContext<FormState | null>(null);
const DispatchContext = createContext<Dispatch<FormAction> | null>(null);

function init(): FormState {
  const base = createInitialState();
  const draft = loadDraft();
  return draft ? { ...base, values: draft, dirty: true } : base;
}

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, undefined, init);

  // External system #1: storage (debounced; sensitive fields stripped inside saveDraft).
  useEffect(() => {
    if (!state.dirty || state.submit.status === "succeeded") return;
    const id = setTimeout(() => saveDraft(state.values), 500);
    return () => clearTimeout(id);
  }, [state.values, state.dirty, state.submit.status]);

  useEffect(() => {
    if (state.submit.status === "succeeded") clearDraft();
  }, [state.submit.status]);

  // External system #2: the browser's unload confirmation.
  const guardActive = state.dirty && state.submit.status !== "succeeded";
  useEffect(() => {
    if (!guardActive) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault(); // modern browsers show a generic message; custom text is ignored
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [guardActive]);

  return (
    <StateContext value={state}>
      <DispatchContext value={dispatch}>{children}</DispatchContext>
    </StateContext>
  );
}

export function useForm(): FormState {
  const v = useContext(StateContext);
  if (v === null) throw new Error("useForm must be used within <FormProvider>");
  return v;
}

export function useFormDispatch(): Dispatch<FormAction> {
  const v = useContext(DispatchContext);
  if (v === null) throw new Error("useFormDispatch must be used within <FormProvider>");
  return v;
}
