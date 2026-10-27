// (i)
for (const el of list) { el.style.height = "10px"; }
const h = list[0].offsetHeight;
// (ii)
for (const el of list) { el.style.height = "10px"; el.dataset.h = String(el.offsetHeight); }
// (iii)
const hs = list.map((el) => el.offsetHeight);
list.forEach((el, i) => { el.style.height = hs[i] + 1 + "px"; });
