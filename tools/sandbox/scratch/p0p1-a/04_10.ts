mo.observe(ul, { childList: true });
ul.append(li2);
ul.insertBefore(ul.lastElementChild!, ul.firstElementChild); // move
