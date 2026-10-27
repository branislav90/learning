// history.ts
export type Command<S> = {
  readonly label: string;
  readonly mergeKey?: string;          // consecutive commands with the same key coalesce
  apply(state: S): S;
  revert(state: S): S;
};

export type History<S> = {
  readonly past: readonly Command<S>[];
  readonly present: S;
  readonly future: readonly Command<S>[];
};

export type HistoryEvent<S> =
  | { type: 'EXEC'; command: Command<S> }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export const initialHistory = <S,>(present: S): History<S> => ({ past: [], present, future: [] });

export const MAX_HISTORY = 200;

export function historyReducer<S>(h: History<S>, e: HistoryEvent<S>): History<S> {
  switch (e.type) {
    case 'EXEC': {
      const last = h.past.at(-1);
      const next = e.command.apply(h.present);
      if (Object.is(next, h.present)) return h;                         // no-op command: not recorded
      if (e.command.mergeKey && last?.mergeKey === e.command.mergeKey) {
        // coalesce: keep the earliest revert, take the latest apply
        const merged: Command<S> = { ...e.command, revert: last.revert };
        return { past: [...h.past.slice(0, -1), merged], present: next, future: [] };
      }
      const past = [...h.past, e.command].slice(-MAX_HISTORY);
      return { past, present: next, future: [] };                        // new branch: redo cleared
    }
    case 'UNDO': {
      const cmd = h.past.at(-1);
      if (!cmd) return h;
      return { past: h.past.slice(0, -1), present: cmd.revert(h.present), future: [cmd, ...h.future] };
    }
    case 'REDO': {
      const [cmd, ...rest] = h.future;
      if (!cmd) return h;
      return { past: [...h.past, cmd], present: cmd.apply(h.present), future: rest };
    }
  }
}
export {};
