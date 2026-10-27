// Layout thrashing: write → read → write → read ...
for (const el of items) {
  el.style.width = container.offsetWidth / 2 + "px"; // read (forces layout if dirty) then write (dirties it)
}
