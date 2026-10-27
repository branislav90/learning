const host = document.createElement("div");
host.innerHTML = "<span>a</span><span>b</span>";
const first = host.firstElementChild!;
host.innerHTML = "<span>a</span><span>b</span>";
console.log(first === host.firstElementChild, first.isConnected, host.childNodes.length);
