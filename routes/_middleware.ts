// routes/_middleware.ts
import type { MiddlewareHandlerContext } from "$fresh/server.ts";

export const handler = [timing, logging];

async function timing(
	_req: Request,
	ctx: MiddlewareHandlerContext,
): Promise<Response> {
	const start = performance.now();
	const res = await ctx.next();
	const end = performance.now();
	const dur = (end - start).toFixed(1);
	res.headers.set("X-Server-Timing", `handler;dur=${dur}`);
	res.headers.set("X-Server-ElapsedTime", dur);
	ctx.state = { ...ctx.state, duration: dur };
	return res;
}

async function logging(
	req: Request,
	ctx: MiddlewareHandlerContext,
): Promise<Response> {
	const res = await ctx.next();
	// console.log({ headers: res.headers, state: ctx.state, res})
	if ("duration" in ctx.state || res.headers.has("X-Server-ElapsedTime")) {
		const duration = res.headers.get("X-Server-ElapsedTime") ??
			ctx.state.duration;
		console.log(`${res.status} - ${duration}ms; ${req.method} ${req.url} `);
	} else {
		console.log(`${res.status}; ${req.method} ${req.url} `);
	}
	return res;
}
