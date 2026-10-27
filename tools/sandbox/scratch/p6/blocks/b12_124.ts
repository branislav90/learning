RETRY: [
  { guard: 'canRetry', target: 'submitting' },
  { target: 'exhausted' },     // fallback
]
export {};
