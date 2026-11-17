import { makeRouteHandler } from "@keystatic/next/route-handler";

import { keystaticConfig } from "@/config/keystatic-config";
import { SITE_CONFIG } from "@/config/site-config";

// In production the dashboard authenticates through a GitHub App, and
// `makeRouteHandler` throws on import without that app's credentials, which
// would also break `next build`. Until they are configured the endpoint is
// switched off instead of failing the deployment.
const isProduction = process.env.NODE_ENV === "production";

const isEnabled =
	!isProduction ||
	Boolean(
		process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
			process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
			process.env.KEYSTATIC_SECRET,
	);

const handler = isEnabled
	? makeRouteHandler({ config: keystaticConfig })
	: null;

// `NEXT_PUBLIC_URL` lets another deployment (e.g. staging) use its own host;
// it must match a callback URL registered on the GitHub App. Like every
// `NEXT_PUBLIC_*` value it is inlined at build time (a Docker build arg), so
// setting it only at runtime has no effect.
const PUBLIC_ORIGIN = process.env.NEXT_PUBLIC_URL || SITE_CONFIG.url;

const disabled = () => new Response("Not found", { status: 404 });

/**
 * Keystatic builds the GitHub OAuth `redirect_uri` from the request origin.
 * Behind the Docker reverse proxy the standalone server binds to `0.0.0.0`,
 * so that origin is `https://0.0.0.0:80` instead of the public domain and
 * GitHub sends the user nowhere. In production the request is re-addressed
 * to the public site URL, which is also the GitHub App's callback host.
 */
function withPublicOrigin(request: Request): Request {
	if (!isProduction) {
		return request;
	}

	const url = new URL(request.url);
	const publicUrl = new URL(`${url.pathname}${url.search}`, PUBLIC_ORIGIN);

	return new Request(publicUrl, request);
}

export async function GET(request: Request): Promise<Response> {
	return handler ? handler.GET(withPublicOrigin(request)) : disabled();
}

export async function POST(request: Request): Promise<Response> {
	return handler ? handler.POST(withPublicOrigin(request)) : disabled();
}
