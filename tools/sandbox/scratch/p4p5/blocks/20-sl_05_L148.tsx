function Button({ asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-variant="primary" className="btn" {...props} />;
}
export {};
