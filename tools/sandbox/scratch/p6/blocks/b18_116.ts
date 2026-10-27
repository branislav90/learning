const sp = new URLSearchParams('?color=red&tag=a&tag=b&page=3');
sp.get('color');        // 'red'   (string | null)
sp.getAll('tag');       // ['a', 'b']
sp.get('page');         // '3'     (string, not number!)
sp.get('missing');      // null
sp.set('page', '4');    // replaces all 'page' entries
sp.append('tag', 'c');  // adds another
sp.delete('color');
sp.toString();          // 'tag=a&tag=b&tag=c&page=4'  (no leading '?')
export {};
