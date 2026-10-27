// Module scope: one function object for the lifetime of the module -> stable type.
const MoneyCell = createCell('money');

// Inside a component body: new function object per render -> new type -> remount.
function Table() { const Cell = createCell('money'); return <Cell />; } // bug
export {};
