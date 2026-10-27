import sys; sys.path.insert(0,'/tmp')
from rep import rep
B='/Users/todorbra/Projects/ReactLearning/react-mastery/'
f=B+'05-design-patterns/19-polymorphic-components.md'
rep(f,"| `React.ElementRef<T>` (legacy-ish) | Ref instance type; deprecated in newer types in favour of `ComponentRef`; verify |","| `React.ElementRef<T>` (deprecated) | Ref instance type; marked `@deprecated` in `@types/react` 19 (checked in 19.3): use `React.ComponentRef<T>` |")
rep(f,"(verify availability in your `@types/react` version)","(present in `@types/react` 19.3: `ElementType<P = any, Tag extends keyof JSX.IntrinsicElements = ...>`)")
