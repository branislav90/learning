function one() { two(); console.log("one done"); }
function two() { three(); console.log("two done"); }
function three() { console.log("X"); }
one();
