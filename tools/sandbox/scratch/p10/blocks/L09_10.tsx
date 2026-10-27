// src/app/LocaleRoot.tsx
import { useEffect, useState, startTransition, type ReactNode } from "react";

export function LocaleRoot({ initialLocale, initialMessages, timeZone, children }: {
  initialLocale: string; initialMessages: Messages; timeZone: string; children: ReactNode;
}) {
  const [state, setState] = useState({ locale: initialLocale, messages: initialMessages });

  async function changeLocale(next: string) {
    const messages = await loadCatalog(next);          // load BEFORE switching: avoid a flash of missing keys
    startTransition(() => setState({ locale: next, messages }));
  }

  useEffect(() => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = RTL.has(state.locale.split("-")[0]!) ? "rtl" : "ltr";
  }, [state.locale]);

  return (
    <I18nProvider locale={state.locale} messages={state.messages} timeZone={timeZone}>
      <LocaleSwitcher current={state.locale} onChange={changeLocale} />
      {children}
    </I18nProvider>
  );
}
