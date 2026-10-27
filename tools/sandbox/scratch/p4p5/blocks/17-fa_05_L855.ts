type Applied<S> = { state: S; inverse: Command<S> };
type Command<S> = {
  label: string;
  mergeKey?: string;
  apply(state: S): Applied<S> | null;                 // null = not applicable (no-op/precondition failed)
  merge?(next: Command<S>): Command<S> | null;       // compose this followed by next into one command
};
type History<S> = { past: readonly Applied<S>['inverse'][]; present: S; future: readonly Command<S>[] };
export {};
