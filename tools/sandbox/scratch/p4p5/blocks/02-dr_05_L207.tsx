type CardProps = {
  variant: "user" | "product";
  layout?: "vertical" | "horizontal";
  image: string;
  title: string;
  subtitle?: string;
  price?: number;
  badge?: string;
  showPresence?: boolean;
  online?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  actionType?: "button" | "stepper";
  qty?: number;
  onQtyChange?: (q: number) => void;
};

function Card(p: CardProps) {
  return (
    <article className={`card card--${p.layout ?? "vertical"}`}>
      <div className="card__media">
        <img src={p.image} alt="" />
        {p.badge && <span className="card__ribbon">{p.badge}</span>}
        {p.variant === "user" && p.showPresence && <span className={p.online ? "dot dot--on" : "dot"} />}
      </div>
      <div className="card__body">
        <h3>{p.title}</h3>
        {p.subtitle && <p>{p.subtitle}</p>}
        {p.variant === "product" && p.price != null && <p>${p.price.toFixed(2)}</p>}
        {p.actionType === "stepper" ? (
          <Stepper value={p.qty ?? 1} onChange={p.onQtyChange!} />
        ) : (
          p.actionLabel && <button onClick={p.onAction}>{p.actionLabel}</button>
        )}
        {p.secondaryActionLabel && <button onClick={p.onSecondaryAction}>{p.secondaryActionLabel}</button>}
      </div>
    </article>
  );
}
export {};
