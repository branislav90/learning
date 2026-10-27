import { createMiddleware } from "./createMiddleware.js";
import { isPromise } from "@tanstack/router-core";
import { createIsomorphicFn } from "@tanstack/start-fn-stubs";
//#region src/createCsrfMiddleware.ts
var csrfSymbol = Symbol.for("tanstack-start:csrf-middleware");
var innerCreateCsrfMiddleware = (opts = {}) => {
	const continueRequest = (result, ctx) => {
		return isValidationResultAllowed(result, opts) ? ctx.next() : getFailureResponse(opts, ctx);
	};
	const validateRequest = (ctx) => {
		const result = validateCsrfRequest(opts, ctx);
		if (isPromise(result)) return result.then((result) => continueRequest(result, ctx));
		return continueRequest(result, ctx);
	};
	const middleware = createMiddleware().server((ctx) => {
		const csrfCtx = ctx;
		try {
			if (opts.filter) {
				const shouldValidate = opts.filter(csrfCtx);
				if (isPromise(shouldValidate)) return shouldValidate.then((shouldValidate) => shouldValidate ? validateRequest(csrfCtx) : ctx.next());
				if (!shouldValidate) return ctx.next();
			}
			return validateRequest(csrfCtx);
		} catch (error) {
			return Promise.reject(error);
		}
	});
	if (process.env.NODE_ENV !== "production") Object.defineProperty(middleware, csrfSymbol, { value: true });
	return middleware;
};
var createCsrfMiddleware = createIsomorphicFn().server(innerCreateCsrfMiddleware);
async function isCsrfRequestAllowed(opts, ctx) {
	return isValidationResultAllowed(await validateCsrfRequest(opts, ctx), opts);
}
function isValidationResultAllowed(result, opts) {
	return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
async function getCsrfRequestValidationResult(opts, ctx) {
	return validateCsrfRequest(opts, ctx);
}
function validateCsrfRequest(opts, ctx) {
	const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
	if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
	const origin = ctx.request.headers.get("Origin");
	if (origin !== null) {
		if (opts.origin) return matchValue(opts.origin, origin, ctx);
		return origin === new URL(ctx.request.url).origin;
	}
	const referer = ctx.request.headers.get("Referer");
	if (referer === null || opts.referer === false) return;
	if (typeof opts.referer === "function") return opts.referer(referer, ctx);
	if (opts.origin) {
		const refererOrigin = getOriginFromUrl(referer);
		return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
	}
	return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
function matchValue(matcher, value, ctx) {
	if (typeof matcher === "function") return matcher(value, ctx);
	if (Array.isArray(matcher)) return matcher.includes(value);
	return value === matcher;
}
function getOriginFromUrl(url) {
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
function isRefererSameOrigin(referer, requestOrigin) {
	if (referer === requestOrigin) return true;
	if (!referer.startsWith(requestOrigin)) return false;
	if (referer.length === requestOrigin.length) return true;
	const code = referer.charCodeAt(requestOrigin.length);
	return code === 47 || code === 63 || code === 35;
}
function getFailureResponse(opts, ctx) {
	if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
	return opts.failureResponse?.clone() ?? new Response("Forbidden", { status: 403 });
}
//#endregion
export { createCsrfMiddleware, csrfSymbol, getCsrfRequestValidationResult, isCsrfRequestAllowed };

//# sourceMappingURL=createCsrfMiddleware.js.map