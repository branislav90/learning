// src/shared/i18n/I18nProvider.tsx
import { createContext, use, useMemo, type ReactNode } from "react";
import { numberFormat, dateFormat } from "./format";

export type Messages = Record<string, string | PluralMessage>;
export interface PluralMessage { one?: string; few?: string; many?: string; two?: string; zero?: string; other: string }

export interface I18n {
  locale: string;
  dir: "ltr" | "rtl";
  t: (id: string, values?: Record<string, string | number>) => string;
  n: (value: number, opts?: Intl.NumberFormatOptions) => string;
  d: (value: Date | number, opts?: Intl.DateTimeFormatOptions) => string;
}

const I18nContext = createContext<I18n | null>(null);
export const RTL = new Set(["ar", "he", "fa", "ur"]);

export function I18nProvider(props: {
  locale: string;
  messages: Messages;
  fallback?: Messages;                // e.g. default-locale messages
  timeZone: string;                   // explicit, so SSR and client agree
  children: ReactNode;
}) {
  const { locale, messages, fallback, timeZone, children } = props;

  const value = useMemo<I18n>(() => {
    const plural = new Intl.PluralRules(locale);
    const lang = locale.split("-")[0]!;

    function t(id: string, values: Record<string, string | number> = {}): string {
      const entry = messages[id] ?? fallback?.[id];
      if (entry === undefined) {
        reportMissing(locale, id);                       // telemetry hook; see lesson 04
        return id;                                       // visible in dev; consider a safe default in prod
      }
      let template: string;
      if (typeof entry === "string") template = entry;
      else {
        const count = Number(values.count ?? 0);
        template = entry[plural.select(count) as keyof PluralMessage] ?? entry.other;
      }
      return template.replace(/\{(\w+)\}/g, (_, name: string) => {
        const v = values[name];
        if (v === undefined) return `{${name}}`;
        return typeof v === "number" ? numberFormat(locale).format(v) : v;
      });
    }

    return {
      locale,
      dir: RTL.has(lang) ? "rtl" : "ltr",
      t,
      n: (v, o) => numberFormat(locale, o).format(v),
      d: (v, o) => dateFormat(locale, { timeZone, ...o }).format(v),
    };
  }, [locale, messages, fallback, timeZone]);

  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18n {
  const ctx = use(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}

function reportMissing(locale: string, id: string) { /* send a low-cardinality telemetry event */ }
