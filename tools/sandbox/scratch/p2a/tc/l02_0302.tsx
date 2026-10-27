import { flushSync } from "react-dom";

function handleClick() {
  flushSync(() => setN((c) => c + 1));
  console.log("DOM text after flushSync:", ref.current?.textContent); // "1"
}
export {};
