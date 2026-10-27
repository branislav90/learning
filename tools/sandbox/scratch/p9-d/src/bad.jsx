import {useRef} from "react";
export function C() { const r = useRef(0); r.current++; return <b>{r.current}</b>; }
export function Badge({ user }) { user.seen = true; return <span>{user.name}</span>; }
let n = 0; export function D() { n++; return <b>{n}</b>; }
