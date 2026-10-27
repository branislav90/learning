const w = container.offsetWidth / 2;     // one read (one layout if dirty)
for (const el of items) el.style.width = w + "px"; // writes only; layout once, later
