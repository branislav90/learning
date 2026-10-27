import sys; sys.path.insert(0,'/tmp')
from rep import rep
Q='/Users/todorbra/Projects/ReactLearning/react-mastery/04-react-architecture/'
f=Q+'17-data-flow-architecture.md'
rep(f,"- Closure caveat: `onSuccess` captures `cart` at the time the mutation *hook options* were created for that render.","- Closure caveat: with TanStack Query v5 the `onSuccess` passed to `useMutation` sees the **latest rendered** closure, not the one from the click (executed on @tanstack/react-query 5.104 + React 19.3: the cart changed from 1 to 2 while the request was pending and the hook-level `onSuccess` logged `cart=2`).")
rep(f,"depending on the library, options may be updated each render (so `onSuccess` may see the *latest* cart) or captured at mutation start — behavior is library-specific (⚠ verify). Either way","with TanStack Query v5 the hook-level options are refreshed on every render, so `onSuccess` sees the *latest* cart (executed: `cart=2` after the cart changed mid-request); other libraries may capture at mutation start. Either way")
