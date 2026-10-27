from ed import apply
E=[
("(static imports are converted to dynamic ones after the mock registration; ⚠ conceptual description, the precise transform is an implementation detail)","(static imports are converted to dynamic ones after the mock registration; this is a conceptual description, the precise transform is an implementation detail)"),
("⚠ The exact message varies by version.","*Verified on 3.2.7:* the suite fails with \"There was an error when mocking a module. If you are using `vi.mock` factory, make sure there are no top level variables inside…\", caused by `ReferenceError: Cannot access 'sendEmail' before initialization`. The exact wording varies by version."),
("⚠ `test.extend` API details (e.g., the `{}` first argument, scoped fixtures) evolve; verify in docs.","*Verified on 3.2.7:* the example runs and the teardown after `await use(...)` executes; the `{}` first argument is the fixtures-destructuring slot (use `{ other }` to depend on another fixture)."),
]
apply("02-unit-testing-with-vitest.md",E)
