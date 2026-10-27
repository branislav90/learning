import { use, useActionState, useOptimistic, useEffectEvent, useEffect, useRef, Activity, createContext, useDeferredValue, useTransition, startTransition, type Ref, type ComponentProps } from "react";
import { useFormStatus, preload, preconnect, preinit, prefetchDNS, preloadModule, preinitModule, requestFormReset } from "react-dom";

type State = { count: number; error?: string };
async function increment(prev: State, formData: FormData): Promise<State> { return { count: prev.count + Number(formData.get("by")) }; }
export function Counter() {
  const [state, formAction, isPending] = useActionState(increment, { count: 0 });
  const s: State = state; const f: (payload: FormData) => void = formAction; const p: boolean = isPending;
  return <form action={formAction}>{s.count}{String(p)}{String(f)}</form>;
}
export function Lst() {
  const [st, dispatch] = useActionState(async (prev: string[], t: string) => [...prev, t], [] as string[]);
  dispatch("x"); // payload string
  const [o, add] = useOptimistic(st, (cur: string[], t: string) => [...cur, t]);
  add("q"); return <p>{o.join()}</p>;
}
export function In({ ref, ...props }: ComponentProps<"input">) { return <input ref={ref} {...props} />; }
export function V({ ref, src }: { ref?: Ref<HTMLVideoElement>; src: string }) { return <video ref={ref} src={src} />; }
export function Bad1() {
  const nodes: HTMLElement[] = [];
  // @ts-expect-error  ref callback returning element should be a type error in @types/react 19
  return <div ref={(el) => (nodes[0] = el!)} />;
}
export function Good1() {
  const nodes = useRef(new Map<string, HTMLElement>());
  return <li ref={(el) => { if (el) nodes.current.set("a", el); return () => { nodes.current.delete("a"); }; }} />;
}
export function Eff({ t, id }: { t: string; id: string }) {
  const log = useEffectEvent((x: string) => console.log(x, id));
  const r: (x: string) => void = log;
  useEffect(() => { log(t); r(t); }, [t]);
  return <Activity mode="hidden"><p>x</p></Activity>;
}
export function Btn() { const { pending, data, method, action } = useFormStatus(); const d: FormData | null = data; return <button disabled={pending}>{method}{String(action)}{String(d)}</button>; }
export function Ctx() { const C = createContext("a"); return <C value="b"><p /></C>; }
export function U({ p }: { p: Promise<{ n: string }> }) { const v = use(p); return <p>{v.n}</p>; }
export function P() { preconnect("https://a.com"); prefetchDNS("https://a.com"); preload("/a.png", { as: "image", fetchPriority: "high" }); preinit("/a.css", { as: "style", precedence: "default" }); preloadModule("/m.js"); preinitModule("/m.js"); return null; }
export function Rf() { requestFormReset(document.forms[0]); return <title>{`x`}</title>; }
export function T() { const [p, st] = useTransition(); st(async () => { await 1; startTransition(() => {}); }); const d = useDeferredValue("a", ""); return <p>{String(p)}{d}</p>; }
