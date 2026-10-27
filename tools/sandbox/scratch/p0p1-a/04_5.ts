const mo = new MutationObserver((records) => {
  for (const r of records) console.log(r.type, r.target, r.addedNodes.length, r.removedNodes.length);
});
mo.observe(list, { childList: true, subtree: true, attributes: true, characterData: true });
// later: mo.disconnect();
