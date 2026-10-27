class P{ m(){return this} }
const {m}=new P(); console.log(m());
function F(){}; console.log(Object.getPrototypeOf(F.prototype)===Object.prototype, F.prototype.constructor===F);
class A{ #x=1; static has(o){return #x in o} }; console.log(A.has(new A), A.has({}));
console.log(Object.hasOwn({a:1},'a'));
const o={}; console.log(typeof Object.groupBy, typeof Array.prototype.at);
