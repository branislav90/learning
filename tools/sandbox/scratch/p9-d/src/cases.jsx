import { useRef, useState, useMemo, useEffect } from "react";
export function Cart({ items }) { const sorted = items; sorted.sort((a,b)=>a-b); return <List items={sorted} />; }
export function Badge({ user }) { user.seen = true; const r = useRef(Date.now()); r.current = Date.now(); return <span>{user.name} {r.current}</span>; }
let currentTheme = "light";
export function Card() { return <div className={currentTheme}>x</div>; }
export function A({ items }) { const total = items.reduce((s, n) => s + n, 0); return <b>{total}</b>; }
export function B({ items }) { items.push(1); return <b>{items.length}</b>; }
export function C() { const r = useRef(0); r.current++; return <b>{r.current}</b>; }
let n = 0; export function D() { n++; return <b>{n}</b>; }
export function Clock() { return <i>{new Date().toLocaleTimeString()}</i>; }
export function ThemeProvider(props) { if (!props.children) return null; const theme = merge(props.theme); return <T value={theme}>{props.children}</T>; }
export function Opts({ options, id }) { const o = useMemo(() => ({a: options.a}), [options.a]); useEffect(()=>{console.log(o)},[o]); return <X onOpen={() => open(id)} o={o}/>; }
export function usefoo() { return 1 }
export function helper(items) { return items.map(i=>i*2) }
export function Directed() { "use no memo"; return <div/>; }
export function Rows({ rows, select, setHover }) { return rows.map((r) => <Row key={r.id} data={r} onClick={() => select(r.id)} onHover={() => setHover(r.id)} />); }
export function Orders({ orders, filter, onOpen }) { const rows = orders.filter(o=>matches(o,filter)).sort(byDate); return <table><tbody>{rows.map(o=> <OrderRow key={o.id} order={o} onOpen={() => onOpen(o.id)} />)}</tbody></table>; }
