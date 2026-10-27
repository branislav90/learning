const ul = document.createElement("ul");
ul.innerHTML = "<li>a</li>\n<li>b</li>";
console.log(ul.childNodes.length, ul.children.length);
const first = ul.firstElementChild!;
ul.innerHTML = ul.innerHTML;
console.log(first.isConnected, first === ul.firstElementChild, ul.children.length);
