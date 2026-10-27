from patchlib import apply
apply('13',[
("It does not accept `enabled` (a suspense query cannot be \"disabled\"; verify),","It does not accept `enabled`, `throwOnError`, `placeholderData` or `skipToken` (the 5.104 typings omit them: a suspense query cannot render a \"disabled\" or \"placeholder\" state),"),
("Not usable: `enabled` (and related disabled states; verify), because","Not usable: `enabled`, `skipToken`, `placeholderData` and `throwOnError` (omitted from `UseSuspenseQueryOptions` in 5.104), because"),
("(or a dev-time error; verify). Fix:","(verified on React 19.3: with `use(new Promise(...))` in render the fallback was still showing after ~320 ms and the component had rendered 18 times; the react.dev `use` reference also documents the warning \"A component was suspended by an uncached promise\"). Fix:"),
("(a third-party wrapper; verify props)","(a third-party wrapper; props checked against v6 typings)"),
])
apply('10',[
("(v4's compatibility shim and the `use-sync-external-store` dependency were reduced; verify the 5.0 release notes)","(verified in 5.0.16: `create` calls `React.useSyncExternalStore` directly; `use-sync-external-store` is now only an optional peer dependency, used by `zustand/traditional`)"),
("Options (verify current API names): `skipHydration`","Options (`skipHydration` and `persist.rehydrate()`/`hasHydrated()` exist in 5.0.16): `skipHydration`"),
])
apply('11',[
("`.Provider` still works and is slated to be deprecated: verify)","`.Provider` still works; the React 19 release post says a codemod will be published and `.Provider` will be deprecated in future versions)"),
])
apply('08',[
("(or via `useMutationState`, verify)","(or via `useMutationState`, exported in 5.104)"),
])
