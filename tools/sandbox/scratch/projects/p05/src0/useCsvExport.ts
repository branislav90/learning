// useCsvExport.ts: Vite bundles workers with this syntax
const worker = new Worker(new URL('./export.worker.ts', import.meta.url), { type: 'module' })
