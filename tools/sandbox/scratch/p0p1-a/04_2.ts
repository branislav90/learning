const frag = document.createDocumentFragment();
for (const item of items) {
  const li = document.createElement("li");
  li.textContent = item.name;
  frag.append(li);
}
list.append(frag); // one insertion; frag becomes empty
