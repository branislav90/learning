type Command =
  | { type: "insert"; at: number; value: string }
  | { type: "delete"; at: number; length: number };

type Doc = { readonly text: string };

function apply(doc: Doc, c: Command): Doc {
  switch (c.type) {
    case "insert":
      return { text: doc.text.slice(0, c.at) + c.value + doc.text.slice(c.at) };
    case "delete":
      return { text: doc.text.slice(0, c.at) + doc.text.slice(c.at + c.length) };
  }
}

function invert(doc: Doc, c: Command): Command {
  switch (c.type) {
    case "insert":
      return { type: "delete", at: c.at, length: c.value.length };
    case "delete":
      return { type: "insert", at: c.at, value: doc.text.slice(c.at, c.at + c.length) };
  }
}

type History = {
  past: Array<{ forward: Command; backward: Command }>;
  present: Doc;
  future: Array<{ forward: Command; backward: Command }>;
};

type Action =
  | { type: "do"; command: Command }
  | { type: "undo" }
  | { type: "redo" };

export function historyReducer(h: History, a: Action): History {
  switch (a.type) {
    case "do": {
      const backward = invert(h.present, a.command);
      return {
        past: [...h.past, { forward: a.command, backward }],
        present: apply(h.present, a.command),
        future: [],
      };
    }
    case "undo": {
      const last = h.past[h.past.length - 1];
      if (!last) return h;
      return {
        past: h.past.slice(0, -1),
        present: apply(h.present, last.backward),
        future: [last, ...h.future],
      };
    }
    case "redo": {
      const next = h.future[0];
      if (!next) return h;
      return {
        past: [...h.past, next],
        present: apply(h.present, next.forward),
        future: h.future.slice(1),
      };
    }
  }
}
export {};
