import {useMemo, useCallback} from "react";
export function MissingDeps({ data, filter }) { const f = useMemo(() => data.filter(filter), [data]); return <L items={f} />; }
export function Callback({ onUpdate, value }) { const h = useCallback(() => onUpdate(value), [onUpdate]); return <button onClick={h}/>; }
// eslint-disable-next-line react-hooks/exhaustive-deps
export function Suppressed({ a }) { return <b>{a}</b>; }
export function TC({ x }) { try { risky(x); } catch (e) { return <i/>; } return <b>{x}</b>; }
export function Cls() { class K {}; return <b/>; }
