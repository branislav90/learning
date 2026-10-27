const li = document.createElement("li");
li.textContent = "Alpha";
list.append(li);                   // append to end (also accepts strings → Text nodes)
list.prepend(li2);                 // beginning
list.insertBefore(li3, li);        // classic; before reference node
li.before(liX); li.after(liY);     // modern ChildNode methods
li.replaceWith(liZ);
li.remove();                       // detach from parent (idempotent)
list.replaceChildren(...newItems); // clear + insert, one operation
