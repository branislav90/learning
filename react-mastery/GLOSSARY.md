# GLOSSARY

Alphabetical. Each entry points to the lesson where the term is taught in depth. "Impl." marks implementation details that can change between React releases.

| Term | Definition | Lesson |
|---|---|---|
| **Abandoned render** | A render that ran but was never committed (superseded or interrupted). | [02/15](./02-react-rendering-and-internals/15-interruptible-restartable-abandoned-rendering.md) |
| **Action** (React 19) | A function run inside a transition, possibly async; tracked for pending state, errors, and form reset. | [03/22](./03-react-state-and-hooks/22-modern-hooks-and-apis.md) |
| **Adapter / port** | A port is the interface the app needs; an adapter implements it for a concrete technology. | [05/15](./05-design-patterns/15-adapter-strategy-factory.md) |
| **Anti-corruption layer** | Mapping code that keeps external wire formats from leaking into the domain model. | [04/14](./04-react-architecture/14-api-boundaries-and-data-access.md) |
| **asChild / Slot** | Pattern merging a component's props and ref onto its single child instead of rendering a wrapper. | [05/20](./05-design-patterns/20-slot-patterns.md) |
| **Automatic batching** | Grouping state updates from any source (events, timers, promises) into one render. | [02/22](./02-react-rendering-and-internals/22-automatic-batching.md) |
| **Bailout** | Skipping a component or subtree because nothing relevant changed. | [02/29](./02-react-rendering-and-internals/29-reasoning-about-unnecessary-renders.md) |
| **Blast radius** | The set of components that re-render when a piece of state changes. | [07/07](./07-performance/07-state-colocation-for-perf.md) |
| **Browser engine** | Component implementing parsing, DOM, style, layout, paint, compositing (Blink, Gecko, WebKit). | [00/01](./00-web-and-javascript-foundations/01-how-the-browser-works.md) |
| **Closure** | A function together with the lexical environment it was created in. | [00/06](./00-web-and-javascript-foundations/06-lexical-scope-and-closures.md) |
| **Commit phase** | Synchronous, uninterruptible phase where React mutates the host (DOM) and runs layout effects. | [02/11](./02-react-rendering-and-internals/11-render-phase-and-commit-phase.md) |
| **Compositor** | Thread that assembles layers into frames; can scroll/animate some properties without the main thread. | [00/03](./00-web-and-javascript-foundations/03-browser-rendering-pipeline.md) |
| **Composition root** | The single place where concrete implementations are chosen and wired. | [05/16](./05-design-patterns/16-dependency-injection.md) |
| **Compound components** | Components sharing implicit state (usually via context) to form one API. | [05/05](./05-design-patterns/05-compound-components.md) |
| **Controlled / uncontrolled** | Value owned by React state (`value`+`onChange`) vs by the DOM (`defaultValue`). | [01/11](./01-react-fundamentals/11-controlled-and-uncontrolled-inputs.md) |
| **Core Web Vitals** | Google's user-centric metrics (LCP, INP, CLS). Thresholds change; verify on web.dev. | [07/21](./07-performance/21-web-vitals-and-budgets.md) |
| **DAL / DTO** | Data Access Layer (auth + shaping in one module); Data Transfer Object (explicit projection safe to send to the client). | [09/12](./09-advanced-rendering-and-ecosystem/12-auth-boundaries.md) |
| **Derived state** | A value computed during render rather than stored. | [03/17](./03-react-state-and-hooks/17-derived-state.md) |
| **Discriminated union** | A union tagged by a literal property, enabling exhaustive narrowing. | [00/18](./00-web-and-javascript-foundations/18-typescript-fundamentals-and-narrowing.md) |
| **Effect Event** | `useEffectEvent` function callable only from Effects that always reads latest values (⚠ verify status). | [03/22](./03-react-state-and-hooks/22-modern-hooks-and-apis.md) |
| **Element (React)** | Plain immutable object `{type, props, key}` describing UI. | [01/04](./01-react-fundamentals/04-elements-components-instances.md) |
| **Event delegation (React)** | One set of listeners on the root container dispatches to React handlers. | [01/10](./01-react-fundamentals/10-event-handling.md) |
| **Expand/contract** | Change a contract by supporting old and new together, migrating callers, then removing the old. | [10/12](./10-production-engineering/12-backward-compatibility.md) |
| **Fiber** | React's internal unit of work and data structure per tree position (Impl.). | [02/09](./02-react-rendering-and-internals/09-fiber-nodes-and-units-of-work.md) |
| **Fitness function** | Automated check that an architectural property still holds. | [04/25](./04-react-architecture/25-architectural-fitness-and-enforcement.md) |
| **Forced synchronous layout** | Reading layout-dependent values while layout is dirty, forcing immediate layout. | [00/03](./00-web-and-javascript-foundations/03-browser-rendering-pipeline.md) |
| **Headless component** | Behavior and accessibility without markup or styles. | [05/07](./05-design-patterns/07-headless-components.md) |
| **Hydration** | Attaching React to server-rendered HTML so it becomes interactive. | [02/25](./02-react-rendering-and-internals/25-hydration-and-selective-hydration.md) |
| **Idempotency key** | Client-generated token letting a server deduplicate retried writes. | [06/15](./06-data-fetching-and-state-ecosystems/15-error-recovery-and-retries.md) |
| **Input delay** | Time from an input event until its handler starts (main thread busy). | [00/01](./00-web-and-javascript-foundations/01-how-the-browser-works.md) |
| **Jank** | Visible stutter from missed frames. | [00/01](./00-web-and-javascript-foundations/01-how-the-browser-works.md) |
| **Key** | Identity claim for an element among siblings; changing it remounts. | [02/07](./02-react-rendering-and-internals/07-identity-keys-and-reconciliation.md) |
| **Lane** | A bit naming a channel of pending work with a priority (Impl.). | [02/14](./02-react-rendering-and-internals/14-lanes.md) |
| **Long task** | Main-thread task of 50 ms or more. | [07/20](./07-performance/20-long-tasks-and-main-thread.md) |
| **Main thread** | Per-document thread running JS, style, layout, paint recording, input dispatch. | [00/01](./00-web-and-javascript-foundations/01-how-the-browser-works.md) |
| **Memoization** | Caching a result keyed by inputs. In React a performance hint, not a semantic guarantee. | [03/11](./03-react-state-and-hooks/11-usememo-and-usecallback.md) |
| **Optimistic overlay** | Temporary view of state (`useOptimistic`) reverting when the Action settles. | [06/05](./06-data-fetching-and-state-ecosystems/05-optimistic-updates.md) |
| **Prop getter** | Function returning the merged props an element needs for a behavior. | [05/06](./05-design-patterns/06-custom-hook-patterns.md) |
| **Purity** | Output depends only on inputs; no observable side effects. React expects render to be pure. | [01/12](./01-react-fundamentals/12-component-purity.md) |
| **Ratchet** | Enforcement baseline that may only improve. | [04/25](./04-react-architecture/25-architectural-fitness-and-enforcement.md) |
| **Rebasing** | Replaying skipped lower-priority updates in order on a base state. | [02/14](./02-react-rendering-and-internals/14-lanes.md) |
| **Reconciliation** | Matching new elements against existing fibers to decide reuse, move, create, delete. | [02/06](./02-react-rendering-and-internals/06-reconciliation-fundamentals.md) |
| **Referential equality** | Two references are equal only if they point to the same object (`Object.is`). | [00/07](./00-web-and-javascript-foundations/07-functions-and-referential-identity.md) |
| **Render phase** | React calling components to compute the next tree; pure, interruptible, repeatable. | [02/11](./02-react-rendering-and-internals/11-render-phase-and-commit-phase.md) |
| **RSC payload** | Streamed serialized tree produced by Server Components (wire format is Impl.). | [02/27](./02-react-rendering-and-internals/27-react-server-components-intro.md) |
| **Scheduling** | Deciding when and in what order pending updates are processed. | [02/13](./02-react-rendering-and-internals/13-scheduler-and-priorities.md) |
| **Selective hydration** | Hydrating Suspense boundaries independently, prioritized by interaction. | [02/25](./02-react-rendering-and-internals/25-hydration-and-selective-hydration.md) |
| **Server state** | Client snapshot of data owned remotely; needs caching, invalidation, refetch. | [06/07](./06-data-fetching-and-state-ecosystems/07-server-state-management.md) |
| **Snapshot (state)** | Fixed props, state, and handlers of one render. | [01/14](./01-react-fundamentals/14-state-as-a-snapshot.md) |
| **Stale closure** | A callback from an older render still reading that render's values. | [03/05](./03-react-state-and-hooks/05-effect-dependencies-and-stale-closures.md) |
| **State colocation** | Keeping state in the lowest component that needs it. | [03/18](./03-react-state-and-hooks/18-state-colocation-and-lifting.md) |
| **Strangler fig** | Incrementally routing traffic from a legacy system to its replacement. | [10/13](./10-production-engineering/13-application-migrations.md) |
| **Structural sharing** | Updates that reuse unchanged subtrees' references. | [00/08](./00-web-and-javascript-foundations/08-objects-references-immutability.md) |
| **Suspense** | Boundary that shows a fallback while descendants wait (e.g. on `use` or lazy code). | [02/24](./02-react-rendering-and-internals/24-suspense-conceptual-internals.md) |
| **Tearing** | One render seeing different values of the same external store. | [03/20](./03-react-state-and-hooks/20-usesyncexternalstore-and-external-stores.md) |
| **Time slicing** | Splitting render work into short chunks that yield to the browser. | [02/15](./02-react-rendering-and-internals/15-interruptible-restartable-abandoned-rendering.md) |
| **Transition** | Update marked non-urgent so it can be interrupted by urgent ones. | [02/23](./02-react-rendering-and-internals/23-transitions-and-deferred-rendering.md) |
| **Version skew** | Old client running against a newer deployment. | [10/02](./10-production-engineering/02-deployment-workflows.md) |
| **Virtual DOM** | A teaching term for React's in-memory description of UI; not a distinct technology. | [02/04](./02-react-rendering-and-internals/04-virtual-dom-what-it-means.md) |
| **Web API / host API** | Functionality supplied to JS by the host (DOM, `fetch`, timers). | [00/01](./00-web-and-javascript-foundations/01-how-the-browser-works.md) |
| **Windowing** | Rendering only visible rows plus overscan. | [07/09](./07-performance/09-windowing-and-virtualization.md) |
