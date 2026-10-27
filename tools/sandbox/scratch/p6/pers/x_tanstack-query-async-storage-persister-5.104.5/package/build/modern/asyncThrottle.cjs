Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_utils = require("./utils.cjs");
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/asyncThrottle.ts
/**
* Wraps an async function so it runs at most once per `interval`, never concurrently, and with the
* arguments of the latest call. Calls made while a run is scheduled only update those arguments.
* @param func - The async function to throttle.
* @param options - The `interval` between runs in milliseconds, and `onError`, called when `func`
* rejects.
* @returns The throttled function.
* @throws {Error} If `func` is not a function.
*/
function asyncThrottle(func, { interval = 1e3, onError = require_utils.noop } = {}) {
	if (typeof func !== "function") throw new Error("argument is not function.");
	let nextExecutionTime = 0;
	let lastArgs = null;
	let isExecuting = false;
	let isScheduled = false;
	return async (...args) => {
		lastArgs = args;
		if (isScheduled) return;
		isScheduled = true;
		while (isExecuting) await new Promise((done) => _tanstack_query_core.timeoutManager.setTimeout(done, interval));
		while (Date.now() < nextExecutionTime) await new Promise((done) => _tanstack_query_core.timeoutManager.setTimeout(done, nextExecutionTime - Date.now()));
		isScheduled = false;
		isExecuting = true;
		try {
			await func(...lastArgs);
		} catch (error) {
			try {
				onError(error);
			} catch {}
		}
		nextExecutionTime = Date.now() + interval;
		isExecuting = false;
	};
}
//#endregion
exports.asyncThrottle = asyncThrottle;

//# sourceMappingURL=asyncThrottle.cjs.map