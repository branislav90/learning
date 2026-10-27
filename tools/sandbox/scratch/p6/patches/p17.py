from patchlib import apply
apply('17',[
("> ⚠ **Verify against current docs.** Browser API details","> **Checked 2026-10-22 against MDN browser-compat data (support versions) and the TanStack Query 5.104 typings; the WebSocket/SSE protocol facts are RFC 6455 / HTML-standard behaviour and were not executed against a live server in this review.** Browser API details"),
("| ⚠ Not universally supported; verify before relying |","| Not universally supported (MDN compat data: `WebSocketStream` Chrome 124 only; `WebTransport` Chrome 97, Firefox 114, Safari 26.4); check before relying |"),
("(MDN/RFC 6455; verify details)","(MDN/RFC 6455)"),
("(the newer `WebSocketStream` aims to fix this; ⚠ not widely available at time of writing — verify).","(the newer `WebSocketStream` aims to fix this; MDN compat data lists it for Chrome 124 only, not Firefox or Safari)."),
("⚠ Calling `close()` on a half-open connection can leave `readyState` at `CLOSING` for a while in some browsers; production clients often also abandon the old socket object (detach handlers, null the reference) and reconnect immediately — verify behavior in the browsers you support.","Calling `close()` on a half-open connection can leave `readyState` at `CLOSING` for a while in some browsers (not verified here); production clients often also abandon the old socket object (detach handlers, null the reference) and reconnect immediately. Test in the browsers you support."),
("(`useEffectEvent` is the emerging purpose-built alternative; ⚠ verify availability in your React version before adopting —","(`useEffectEvent` is the purpose-built alternative and is stable in React 19.2+; it is exported by `react` 19.3 and documented on react.dev, with the restriction that an Effect Event may only be called from inside Effects —"),
("(with `refetchIntervalInBackground: false` — verify option)","(with `refetchIntervalInBackground: false`, an option in the TanStack Query v5 typings)"),
])
