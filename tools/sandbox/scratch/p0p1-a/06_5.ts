function setup() {
  const huge = new Array(1_000_000).fill(0);          // used by the first closure only
  const summarize = () => huge.length;
  const later = () => "hi";                           // doesn't use huge...
  window.addEventListener("resize", later);           // ...but can keep the shared env alive in some engines
  return summarize;
}
