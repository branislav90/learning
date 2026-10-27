type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "ghost";
  loading?: boolean;
};

function Button({ variant = "primary", loading = false, className, children, disabled, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={`btn btn--${variant}${className ? " " + className : ""}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  );
}
export {};
