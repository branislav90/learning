import sys; sys.path.insert(0,'/tmp')
from rep import rep
R='/Users/todorbra/Projects/ReactLearning/react-mastery/'
f=R+'04-react-architecture/06-feature-vs-layer-structure.md'
rep(f,'''    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }''','''    "paths": { "@/*": ["./src/*"] }''')
rep(f,"⚠ `baseUrl` is no longer required for `paths` in newer TypeScript versions and may be deprecated in future major versions; check the current TypeScript docs for your version.","`baseUrl` is not needed for `paths` (so it is omitted above, with `./`-prefixed targets): TypeScript 6.0 deprecated `baseUrl` and TypeScript 7.0 does not support it (devblogs.microsoft.com/typescript/announcing-typescript-6-0, checked 2026-10-22). Older tutorials that show `\"baseUrl\": \".\"` still work on TypeScript 5.x.")
f=R+'04-react-architecture/14-api-boundaries-and-data-access.md'
rep(f,"mock tooling (MSW 2.x),","mock tooling (MSW 2.x; MSW 3.0 is now current and moves `http`/`HttpResponse` to `msw/http` and requires Node 22, see mswjs.io/docs/migrations/2.x-to-3.x),")
rep(f,"(Vitest + MSW 2.x style; ⚠ verify API for your version)","(Vitest + MSW 2.x style; the handler/server API below ran on msw 2.15 + Vitest 3. On MSW 3 import `http` and `HttpResponse` from `msw/http`; `setupServer` stays in `msw/node`)")
f=R+'05-design-patterns/17-facade-and-command.md'
rep(f,"(the React Router 7 package layout differs from 6)","(React Router 7+ imports from `react-router`, not `react-router-dom`; 8.x is current as of 2026-10)")
