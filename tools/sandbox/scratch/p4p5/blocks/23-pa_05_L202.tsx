// Before (legacy, still works in 19)
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  return <input ref={ref} {...props} />;
});

// After (React 19)
type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  ref?: React.Ref<HTMLInputElement>;
};
function Input({ ref, ...props }: InputProps) {
  return <input ref={ref} {...props} />;
}
export {};
