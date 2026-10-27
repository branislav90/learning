const a = document.createElement("li"); a.textContent = "A";
const ul1 = document.createElement("ul");
const ul2 = document.createElement("ul");
ul1.append(a);
ul2.append(a);                         // move
console.log(ul1.children.length, ul2.children.length); // ?
const copy = a.cloneNode(true) as HTMLElement;
ul1.append(copy);
console.log(copy === a, ul1.children.length, ul2.children.length); // ?
