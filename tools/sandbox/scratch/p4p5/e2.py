import sys; sys.path.insert(0,'/tmp')
from rep import rep
B='/Users/todorbra/Projects/ReactLearning/react-mastery/'
f=B+'05-design-patterns/19-polymorphic-components.md'
rep(f,"""type RenderProps = React.ComponentPropsWithRef<'button'>;

export function Button({ render, className, ...rest }: {
  render?: (props: RenderProps & { className: string }) => React.ReactElement;
  variant?: 'primary' | 'secondary';
} & RenderProps) {""","""type RenderProps = React.HTMLAttributes<HTMLElement>;   // element-agnostic subset

export function Button({ render, className, ...rest }: {
  render?: (props: RenderProps & { className: string }) => React.ReactElement;
  variant?: 'primary' | 'secondary';
} & React.ComponentPropsWithoutRef<'button'>) {""")
rep(f,"the render function's prop type is `button` props even when you render an `<a>` (you may spread attributes that anchors do not support, e.g. `type`, `disabled`; the type system will not stop you).","the render function receives only the element-agnostic `HTMLAttributes<HTMLElement>` (typed this way on purpose: typing it as `ComponentPropsWithRef<'button'>` makes `<a {...p} />` a compile error under `strict`, because the `HTMLButtonElement` handler and ref types do not match the anchor's; verified with tsc 5.9), yet at runtime button-only attributes such as `type` and `disabled` still flow through `rest` and the type system will not warn you when you spread them onto an `<a>`.")
