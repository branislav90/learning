function Slot({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactElement }) {
  return React.cloneElement(children, props);
}
function Button({ asChild, ...props }: { asChild?: boolean } & React.ComponentProps<"button">) {
  const Comp = asChild ? Slot : "button";
  return <Comp className="btn" onClick={() => track("button")} {...props} />;
}

// usage
<Button asChild ref={buttonRef}>
  <a href="/pay" onClick={() => track("link")} ref={linkRef}>Pay</a>
</Button>
export {};
