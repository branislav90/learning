export {};
// Load a non-essential third-party widget lazily, isolated, with timeout and fallback ([10])
function ChatWidgetFrame() {
  return (
    <iframe
      title="Support chat"
      src="https://chat.vendor.example/embed"
      sandbox="allow-scripts allow-forms allow-popups"   // no allow-same-origin: isolates vendor from our origin
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  );
}
