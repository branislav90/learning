export {};
// Receiving messages: verify origin and shape
const ALLOWED_ORIGINS = new Set(["https://widgets.example.com"]);

window.addEventListener("message", (event: MessageEvent) => {
  if (!ALLOWED_ORIGINS.has(event.origin)) return;      // never "*" and never skip this
  const data = event.data as unknown;
  if (!isWidgetMessage(data)) return;                    // validate schema, don't trust shape
  handle(data);
});

// Sending: always name the target origin
iframe.contentWindow?.postMessage({ type: "init", locale }, "https://widgets.example.com");
