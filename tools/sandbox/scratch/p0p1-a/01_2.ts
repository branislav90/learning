// worker.ts
self.onmessage = (e: MessageEvent<number>) => {
  let sum = 0;
  for (let i = 0; i < e.data; i++) sum += i;
  self.postMessage(sum);
};

// main.ts
const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
button.onclick = () => {
  worker.onmessage = (e) => (out.textContent = String(e.data));
  worker.postMessage(1e9);
};
