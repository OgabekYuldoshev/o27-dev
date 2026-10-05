// Liveness probe for uptime monitors and load balancers; must never be cached.
export const dynamic = "force-dynamic";

const HEADERS = {
	"Cache-Control": "no-store, max-age=0",
};

export function GET(): Response {
	return Response.json(
		{
			status: "ok",
			uptime: Math.round(process.uptime()),
			timestamp: new Date().toISOString(),
		},
		{ headers: HEADERS },
	);
}

export function HEAD(): Response {
	return new Response(null, { headers: HEADERS });
}
