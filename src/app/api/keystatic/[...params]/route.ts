import { makeRouteHandler } from "@keystatic/next/route-handler";

import { keystaticConfig } from "@/config/keystatic-config";

// In production the dashboard authenticates through a GitHub App, and
// `makeRouteHandler` throws on import without that app's credentials, which
// would also break `next build`. Until they are configured the endpoint is
// switched off instead of failing the deployment.
const isEnabled =
	process.env.NODE_ENV !== "production" ||
	Boolean(
		process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
			process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
			process.env.KEYSTATIC_SECRET,
	);

const handler = isEnabled
	? makeRouteHandler({ config: keystaticConfig })
	: null;

const disabled = () => new Response("Not found", { status: 404 });

export async function GET(request: Request): Promise<Response> {
	return handler ? handler.GET(request) : disabled();
}

export async function POST(request: Request): Promise<Response> {
	return handler ? handler.POST(request) : disabled();
}
