type LocaleValue = { locale: string; setLocale: (l: string) => void };
const LocaleContext = createContext<LocaleValue | undefined>(undefined);

export function LocaleProvider({ initial = "en", children }: { initial?: string; children: ReactNode }) {
  const [locale, setLocale] = useState(initial);
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext value={value}>{children}</LocaleContext>;
}
export function useLocale() {
  const v = useContext(LocaleContext);
  if (!v) throw new Error("useLocale requires <LocaleProvider>");
  return v;
}
export {};
