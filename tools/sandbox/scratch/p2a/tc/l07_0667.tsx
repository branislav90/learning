type Toast = { id: string; text: string };
export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toasts">
      {toasts.map((t) => <div key={t.id} className="toast enter">{t.text}</div>)}
    </div>
  );
}
/* CSS: .toast.enter { animation: slide-in 200ms ease-out; } */
