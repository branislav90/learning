import sys; sys.path.insert(0,'/tmp')
from rep import rep
B='/Users/todorbra/Projects/ReactLearning/react-mastery/'
f=B+'05-design-patterns/19-polymorphic-components.md'
rep(f,"""<Button href="/pricing" type="submit">x</Button>            // ERROR: 'type' not on anchor props (when discriminated by href)""","""<Button href="/pricing" formAction="/x">x</Button>          // ERROR: 'formAction' not on anchor props (when discriminated by href)""")
rep(f,"Notes: `href: string` (required","Notes (checked with tsc 5.9 + @types/react 19: note that `<a type=\"submit\">` is *not* an error, because `type` is a valid anchor attribute (a MIME-type hint), so use button-only props such as `formAction`/`disabled` to see the narrowing): `href: string` (required")
rep(f,"(props: { as?: C } & React.ComponentPropsWithoutRef<C>): JSX.Element","(props: { as?: C } & React.ComponentPropsWithoutRef<C>): React.JSX.Element")
