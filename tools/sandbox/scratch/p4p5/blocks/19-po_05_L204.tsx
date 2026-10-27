// INCORRECT: compiles, enforces nothing
function Button({ as: Component = 'button', ...props }: { as?: React.ElementType; [key: string]: any }) {
  return <Component className="btn" {...props} />;
}
<Button as="div" href="/x" typo="oops" onClick="not a function" />   // all accepted
export {};
