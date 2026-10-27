function getButtonProps(props: ComponentProps<"button"> = {}) {
  return { onClick: toggle, "aria-expanded": open, ...props };    // consumer's onClick REPLACES toggle
}
export {};
