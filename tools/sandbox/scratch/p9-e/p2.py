p='/Users/todorbra/Projects/ReactLearning/react-mastery/09-advanced-rendering-and-ecosystem/09-framework-architecture.md'
s=open(p).read()
def r(a,b):
    global s
    assert s.count(a)==1,a
    s=s.replace(a,b)
r("**Framework APIs shown are illustrative and version-sensitive; verify them.**","Framework snippets reflect Next.js 16, React Router 7/8 and TanStack Start 1.169 as checked against their docs on 2026-10-22 (they are trimmed for teaching and not complete apps).")
r("(framework-specific; verify)","(framework-specific; for Next.js see the self-hosting guide's `cacheHandler`/`cacheHandlers` and tag-coordination sections)")
r('<OrdersTable />   {/* useQuery(["orders"]) — data already present at first render */}','<OrdersTable />   {/* useQuery({ queryKey: ["orders"], queryFn }) — data already present at first render */}')
r('`export const dynamic = "force-dynamic"` sprinkled to "fix" staleness without understanding;','`export const dynamic = "force-dynamic"` sprinkled to "fix" staleness without understanding (with Cache Components enabled the Next.js migration guide says to remove it);')
open(p,'w').write(s)
