import { createContext, useContext, type ReactNode } from "react";
import type { OnboardingApi } from "./onboardingApi";
const Ctx = createContext<OnboardingApi | null>(null);
export function ApiProvider({ api, children }: { api: OnboardingApi; children: ReactNode }) { return <Ctx value={api}>{children}</Ctx>; }
export function useOnboardingApi(): OnboardingApi { const v = useContext(Ctx); if (!v) throw new Error("no api"); return v; }
