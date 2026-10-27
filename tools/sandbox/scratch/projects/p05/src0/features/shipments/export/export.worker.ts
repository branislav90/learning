// features/shipments/export/export.worker.ts
/// <reference lib="webworker" />
interface StartMsg { type: 'start'; url: string; params: string }
interface CancelMsg { type: 'cancel' }
let controller: AbortController | null = null

self.onmessage = async (e: MessageEvent<StartMsg | CancelMsg>) => {
  if (e.data.type === 'cancel') return controller?.abort()
  controller = new AbortController()
  const chunks: string[] = ['reference,customer,status,price\n']
  let cursor: string | null = null, done = 0
  try {
    do {
      const res: Response = await fetch(`${e.data.url}?${e.data.params}&limit=2000${cursor ? `&cursor=${cursor}` : ''}`, { signal: controller.signal })
      const page: { items: CsvRow[]; nextCursor: string | null; total: number } = await res.json()
      chunks.push(page.items.map(toCsvLine).join('\n') + '\n')
      cursor = page.nextCursor
      done += page.items.length
      self.postMessage({ type: 'progress', done, total: page.total })
    } while (cursor)
    self.postMessage({ type: 'done', blob: new Blob(chunks, { type: 'text/csv' }) })
  } catch (err) {
    self.postMessage({ type: (err as Error).name === 'AbortError' ? 'cancelled' : 'error' })
  }
}
interface CsvRow { reference: string; customer: string; status: string; price: number }
function toCsvLine(s: CsvRow) {
  const esc = (v: string) => `"${v.replaceAll('"', '""')}"`
  return [esc(s.reference), esc(s.customer), s.status, s.price].join(',')
}
