const ToastsCtx = createContext<Toast[] | null>(null);
const ToastActionsCtx = createContext<{ push: (t: Omit<Toast, 'id'>) => void; dismiss: (id: string) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const actions = useMemo(() => ({
    push: (t: Omit<Toast, 'id'>) => setToasts((xs) => [...xs, { ...t, id: crypto.randomUUID() }]),
    dismiss: (id: string) => setToasts((xs) => xs.filter((x) => x.id !== id)),
  }), []);                                  // stable: uses functional updates, no deps on state
  return <ToastActionsCtx value={actions}><ToastsCtx value={toasts}>{children}</ToastsCtx></ToastActionsCtx>;
}
export {};
