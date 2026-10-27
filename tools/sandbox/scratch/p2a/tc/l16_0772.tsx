export function PendingRegion({ isPending, children }: { isPending: boolean; children: React.ReactNode }) {
  return (
    <div aria-busy={isPending} style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 120ms" }}>
      {children}
    </div>
  );
}
