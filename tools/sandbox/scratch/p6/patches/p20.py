from patchlib import apply
apply('20',[
("⚠ Library-specific answers are \"verify against current docs\" items; where an answer depends on a library detail, the key says so and awards credit for the *concept* even if a name or default differs by version.","Library-specific answers were checked on 2026-10-22 against TanStack Query 5.104, Redux Toolkit 2.13, Zustand 5.0.16 and XState 5.33 (timeline, retry, render-count and API-name answers were executed; see the changelog). Where an answer depends on a library detail, the key says so and awards credit for the *concept* even if a name or default differs by version."),
(" ⚠ Verify the default delay formula in the docs for your version; credit is given for correct reasoning from your stated assumption."," (The default delay `min(1000 * 2^failureCount, 30000)` ms and the timeline in the key were verified against TanStack Query 5.104.)"),
("// ⚠ verify browser/Node support","// Chrome 116, Firefox 124, Safari 17.4; Node 20.3+ (MDN)"),
(" (verify count semantics)"," (verified: inside `onSettled` the settling mutation still counts, so the last one sees 1)"),
("// Suspense-aware hook from a data library (TanStack Query v5; verify)","// Suspense-aware hook from a data library (TanStack Query v5; `useSuspenseQuery`)"),
("(verify count semantics)","(verified)"),
("fetchStatus: 'fetching'` (retry delays count as fetching in the library's model; verify), `failureCount` 2 (verify counts)","fetchStatus: 'fetching'` (retry delays count as fetching in the library's model; verified in 5.104), `failureCount` 2 (verified)"),
])
