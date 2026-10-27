import { noop } from "./utils.js";
import { timeoutManager } from "@tanstack/query-core";
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
function asyncThrottle(func, { interval = 1e3, onError = noop } = {}) {
	if (typeof func !== "function") throw new Error("argument is not function.");
	let nextExecutionTime = 0;
	let lastArgs = null;
	let isExecuting = false;
	let isScheduled = false;
	return async (...args) => {
		lastArgs = args;
		if (isScheduled) return;
		isScheduled = true;
		while (isExecuting) await new Promise((done) => timeoutManager.setTimeout(done, interval));
		while (Date.now() < nextExecutionTime) await new Promise((done) => timeoutManager.setTimeout(done, nextExecutionTime - Date.now()));
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
export { asyncThrottle };

//# sourceMappingURL=asyncThrottle.js.map