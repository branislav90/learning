import sys; sys.path.insert(0,'/tmp')
from rep import rep
f='/Users/todorbra/Projects/ReactLearning/react-mastery/05-design-patterns/13-state-machine-pattern.md'
rep(f,"### 5.6 Library form: XState (⚠ verify against current docs)","### 5.6 Library form: XState (v5; executed against xstate 5.33)")
rep(f,"Below is the *shape* of a v5 machine (verify names against the current Stately docs before copying):","Below is a v5 machine; it type-checks under `strict` with xstate 5.33 and, when run with `createActor`, goes `submitting:1 → failure:1 → submitting:2 → success:2` when the first call rejects and the retry succeeds:")
rep(f,"`@xstate/react` returns `[snapshot, send]`,","`@xstate/react` (6.x) returns `[snapshot, send, actorRef]`,")
rep(f,"Verify current `useActionState` semantics (⚠ concurrent action queuing behaviour) in the reference.","Per react.dev/reference/react/useActionState (2026-10-22): multiple `dispatchAction` calls are queued and run sequentially, each receiving the previous result; if an action throws, queued actions are cancelled and the nearest Error Boundary shows.")
