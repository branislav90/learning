type Setter<T> = (v: T | ((prev: T) => T)) => void;
type Hooks = { useState: <T>(initial: T) => [T, Setter<T>] };

function createComponent<P>(component: (hooks: Hooks, props: P) => () => void) {
  const states: unknown[] = [];        // state lives OUTSIDE the component function
  let hookIndex = 0;
  let props!: P;
  let handler: () => void = () => {};

  const hooks: Hooks = {
    useState<T>(initial: T): [T, Setter<T>] {
      const i = hookIndex++;           // identity of a hook = its call position
      if (!(i in states)) states[i] = initial;
      const set: Setter<T> = (v) => {
        const prev = states[i] as T;
        states[i] = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        render(props);                 // synchronous re-render (no batching)
      };
      return [states[i] as T, set];
    },
  };

  function render(p: P) {
    props = p;
    hookIndex = 0;
    handler = component(hooks, p);     // returns the "event handler" created this render
  }
  return { render, getHandler: () => handler };
}

// Demo
const app = createComponent<{}>((h) => {
  const [n, setN] = h.useState(0);
  console.log("render, n =", n);
  return () => setN(n + 1);            // closes over THIS render's n
});
app.render({});                        // render, n = 0
const h1 = app.getHandler();           // handler from render #1 (closes over n = 0)
h1();                                  // render, n = 1
h1();                                  // render, n = 1  (stale: computes 0 + 1 again)
