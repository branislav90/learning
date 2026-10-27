// ❌ the input freezes until the server answers, and typing is lost
<input value={name} onChange={async (e) => { await save(e.target.value); setName(e.target.value); }} />

// ✓ update synchronously; persist asynchronously
<input value={name} onChange={(e) => { setName(e.target.value); debouncedSave(e.target.value); }} />
export {};
