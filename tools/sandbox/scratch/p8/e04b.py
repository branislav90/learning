from ed import apply
old_start="`userEvent.setup()` defaults `delay: 0`, meaning between actions it awaits a `setTimeout(0)` (\"let the event loop breathe\"). With fake timers, that timeout never fires → `await user.click()` hangs. Configure either:\n\n```ts\nconst user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) }); // user-event advances fake time itself\n// or\nconst user = userEvent.setup({ delay: null });  // skip the inter-action timeout\n```\n⚠ Verify the option names (`advanceTimers`, `delay`) against the user-event docs for your version."
new='''`userEvent.setup()` defaults `delay: 0`, meaning between actions it awaits a `setTimeout(0)` ("let the event loop breathe"). With fake timers, that timeout never fires. user-event's own options address that part:

```ts
const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) }); // user-event advances fake time itself
// or
const user = userEvent.setup({ delay: null });  // skip the inter-action timeout
```

**But this is not sufficient with Vitest** (verified on Vitest 3.2.7 + RTL 16.3.3 + user-event 14.6.8, all four variants below were run). Every `user.*` call, `findBy*`, `waitFor` and `waitForElementToBeRemoved` also goes through RTL's `asyncWrapper`, which finishes with `await new Promise(r => setTimeout(r, 0))` and only calls `jest.advanceTimersByTime(0)` if a global `jest` exists. Under plain `vi.useFakeTimers()` that `setTimeout` is faked and never fires:

| Setup | Result |
|---|---|
| `vi.useFakeTimers()` + `userEvent.setup()` | `await user.type(...)` hangs |
| `vi.useFakeTimers()` + `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` | still hangs (RTL's drain) |
| `vi.useFakeTimers()` + `userEvent.setup({ delay: null })` | still hangs (RTL's drain) |
| `vi.useFakeTimers()` + `fireEvent` + `findBy*`/`waitFor` | hangs (no auto-advance) |

Working fixes, from most to least deterministic:

```ts
// 1) Make Testing Library think it is under Jest: it then advances fake time itself
//    while polling and while draining. Put this next to vi.useFakeTimers().
beforeEach(() => {
  vi.stubGlobal("jest", { advanceTimersByTime: vi.advanceTimersByTime.bind(vi) });
  vi.useFakeTimers();
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });

// 2) Let fake time also move with real time (20 ms ticks). Unblocks everything,
//    but fake time is no longer fully under your control (a "299 ms" assertion can race).
vi.useFakeTimers({ shouldAdvanceTime: true });

// 3) Do not fake the timer that RTL/user-event wait on: fake only what the code under test uses
//    (for example just Date and setInterval), and keep setTimeout real.
vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] });
```

Option 1 passed the debounce and stale-response tests in §5.2 (`findByText` also resolved while fake timers were installed); option 2 passed a typing + `advanceTimersByTime` test; option 3 let `user.type` complete. With any of them, still advance the fake clock for your own timers with `await act(async () => { await vi.advanceTimersByTimeAsync(ms) })`. The `jest` stub works only because DTL checks `typeof jest !== "undefined"` and that `setTimeout` has a fake-timers `clock`; other libraries that sniff for `jest` may change behavior, so keep the stub local to the tests that need it. Option names `advanceTimers` and `delay` are confirmed in user-event 14.6.8 (`utils/misc/wait.js`).'''
E=[(old_start,new),
("Prefer faking only what you need: `vi.useFakeTimers({ toFake: [\"setTimeout\", \"clearTimeout\", \"Date\"] })` ⚠ verify `toFake` item names, which keeps `setImmediate`/`MessageChannel`/`queueMicrotask` real.",
 "Prefer faking only what you need: `vi.useFakeTimers({ toFake: [\"setTimeout\", \"clearTimeout\", \"Date\"] })` (item names verified; Vitest's default fakes everything except `nextTick` and `queueMicrotask`, including `setImmediate`, `performance` and `requestAnimationFrame`), which keeps `MessageChannel`/`queueMicrotask` real. Remember RTL's async utilities need a *real* or auto-advanced `setTimeout`, so faking `setTimeout` requires the fix in §3.4."),
("- `userEvent.setup({ advanceTimers })` prevents `user.type` hanging under fake timers. `vi.advanceTimersByTime.bind(vi)` binds `this` correctly; passing the bare function could lose context ⚠ (Vitest's `vi` methods are often safe unbound, but binding is harmless; verify).",
 "- `userEvent.setup({ advanceTimers })` lets user-event's own inter-action wait advance fake time; the `jest` stub in `beforeEach` is what stops RTL's `asyncWrapper` from hanging (§3.4; without it **both tests hang until the 5 s test timeout**, verified). `vi.advanceTimersByTime.bind(vi)` is harmless; passing the bare function also worked in the runs."),
("beforeEach(() => { vi.useFakeTimers(); });\nafterEach(() => { vi.useRealTimers(); });\n\nfunction setup(",
 "beforeEach(() => {\n  // Testing Library only auto-advances *Jest* fake timers; this stub makes it advance Vitest's (lesson §3.4)\n  vi.stubGlobal(\"jest\", { advanceTimersByTime: vi.advanceTimersByTime.bind(vi) });\n  vi.useFakeTimers();\n});\nafterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });\n\nfunction setup("),
("⚠ Note: `status` is a dependency of the effect, so when it flips to `done` React cleans up the interval. In Strict Mode, the effect would mount-unmount-mount without issue because cleanup clears the interval.",
 "Note: `status` is a dependency of the effect, so when it flips to `done` React cleans up the interval. In Strict Mode, the effect would mount-unmount-mount without issue because cleanup clears the interval (verified: the same polling test also passes inside `<StrictMode>`)."),
("(Playwright has a clock API ⚠ verify in current docs)","(Playwright has a clock API, `page.clock.install()` / `fastForward()` / `runFor()`, since 1.45; see [lesson 09](./09-e2e-with-playwright.md))"),
("(`vitest --repeat`/shell loop; ⚠ verify flag)","(Vitest has no `--repeat` CLI flag; use the per-test `repeats` option, e.g. `test(\"…\", { repeats: 200 }, fn)`, or a shell loop)"),
("or `vi.useFakeTimers({ shouldAdvanceTime: true })` to let fake time advance with real time (⚠ verify option) — a compromise that sacrifices determinism.","or `vi.useFakeTimers({ shouldAdvanceTime: true })` to let fake time advance with real time (option verified to unblock `user.type`/`findBy`) — a compromise that sacrifices determinism. The most deterministic fix is the `jest` stub from §3.4."),
("**A5.** `userEvent` (default `delay: 0`) waits on a `setTimeout(0)` between actions; fake `setTimeout` never fires unless time advances, so the promise never resolves. Remedies: `userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })` so user-event advances fake time itself; or `userEvent.setup({ delay: null })` to remove the inter-action timeout; or fake only the timers you need (`toFake`) leaving the one user-event uses real ⚠ verify which timer it uses in your version.",
 "**A5.** Two waits use `setTimeout(0)`: user-event's inter-action delay (default `delay: 0`) and RTL's `asyncWrapper` drain after every `user.*`/`findBy`/`waitFor`. A faked `setTimeout` never fires unless time advances, so the promise never resolves. Remedies (all verified on Vitest 3.2.7): stub a global `jest` with `advanceTimersByTime` so Testing Library advances Vitest's fake time (and pass `userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })`); or `vi.useFakeTimers({ shouldAdvanceTime: true })`; or fake only the timers you need (`toFake`) leaving `setTimeout` real. `advanceTimers` or `delay: null` *alone* do not fix it, because of RTL's drain."),
("if you must use `findBy` with fake timers, try `vi.useFakeTimers({ shouldAdvanceTime: true })` and verify.","if you must use `findBy` with fake timers, stub the `jest` global as in §3.4 (or use `vi.useFakeTimers({ shouldAdvanceTime: true })`; both verified to unblock `findBy`)."),
("Always restore, configure user-event's `advanceTimers`, and know that Vitest fake timers aren't auto-detected by Testing Library the way Jest's are ⚠ verify.","Always restore, configure user-event's `advanceTimers`, and know that Vitest fake timers aren't auto-detected by Testing Library the way Jest's are (verified: `user.*`, `findBy*` and `waitFor` hang until you stub `jest`, use `shouldAdvanceTime`, or avoid faking `setTimeout`)."),
]
apply("04-testing-async-updates.md",E)
