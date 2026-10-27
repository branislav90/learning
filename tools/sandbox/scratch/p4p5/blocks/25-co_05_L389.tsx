  if (asChild) {
    return <Slot ref={ref} className="btn" data-variant={variant} data-tone={tone} data-size={size} {...rest}>{children as React.ReactElement}</Slot>;
  }
export {};
