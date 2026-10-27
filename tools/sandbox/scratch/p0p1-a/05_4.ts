function third()  { console.log(new Error("trace").stack?.split("\n").slice(1).length); }
function second() { third(); }
function first()  { second(); }
first();
