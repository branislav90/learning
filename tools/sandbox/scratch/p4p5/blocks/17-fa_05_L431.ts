// command-registry.ts
import { createStore } from './store';          // Lesson 14 (5.3)

export type CommandContext = { selection: readonly string[]; hasUnsaved: boolean; navigate(to: string): void };

export type AppCommand = {
  readonly id: string;                           // 'doc.save'
  readonly title: string;
  readonly keywords?: readonly string[];
  readonly shortcut?: string;                    // 'Mod+S'
  readonly when?: (ctx: CommandContext) => boolean;   // enabled predicate
  readonly run: (ctx: CommandContext) => void | Promise<void>;
};

const store = createStore<ReadonlyMap<string, AppCommand>>(new Map());

export const commandRegistry = {
  subscribe: store.subscribe,
  getAll: store.getState,
  register(cmd: AppCommand): () => void {
    store.setState((prev) => {
      if (prev.has(cmd.id) && import.meta.env?.DEV) console.warn(`Duplicate command id: ${cmd.id}`);
      const next = new Map(prev); next.set(cmd.id, cmd); return next;       // immutable update: new Map
    });
    return () => store.setState((prev) => {
      const cur = prev.get(cmd.id);
      if (cur !== cmd) return prev;               // someone else re-registered; don't remove theirs
      const next = new Map(prev); next.delete(cmd.id); return next;
    });
  },
};
export {};
