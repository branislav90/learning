export {};
// ❌ Incorrect: no role, name, focus, or keyboard support
<div className="btn" onClick={save}>Save</div>

// ✅ Corrected
<button type="button" className="btn" onClick={save}>Save</button>
