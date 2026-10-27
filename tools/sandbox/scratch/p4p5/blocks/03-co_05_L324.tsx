type ButtonProps = React.ComponentProps<"button">;

function Button({ className, ...rest }: ButtonProps) {
  return <button {...rest} className={className ? `btn ${className}` : "btn"} />;
}

function IconButton({ icon, children, ...rest }: ButtonProps & { icon: string }) {
  return (
    <Button {...rest}>
      <img src={icon} alt="" />
      {children}
    </Button>
  );
}
export {};
