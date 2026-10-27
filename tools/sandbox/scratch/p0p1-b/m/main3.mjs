import { n, inc } from "./c.mjs"; import * as ns from "./c.mjs";
inc(); inc(); console.log(n, ns.n);
try { n = 5 } catch(e){ console.log(e.name+": "+e.message) }
