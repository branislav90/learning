// ui/CardFrame.tsx — the part that was genuinely common: layout shell
type CardFrameProps = React.ComponentProps<"article"> & {
  media: React.ReactNode;
  layout?: "vertical" | "horizontal";
};
export function CardFrame({ media, layout = "vertical", className, children, ...rest }: CardFrameProps) {
  return (
    <article {...rest} className={`card card--${layout}${className ? " " + className : ""}`}>
      <div className="card__media">{media}</div>
      <div className="card__body">{children}</div>
    </article>
  );
}
export {};
