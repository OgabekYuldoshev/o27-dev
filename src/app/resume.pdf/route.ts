import { RESUME_FILE_NAME, renderResumePdf } from "@/features/resume";

// Content only changes when the repo is rebuilt, so the PDF is rendered once
// at build time and served as a static file.
export const dynamic = "force-static";

const CACHE_CONTROL =
	"public, max-age=0, s-maxage=3600, stale-while-revalidate";

export async function GET(): Promise<Response> {
	const pdf = await renderResumePdf();

	return new Response(pdf, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="${RESUME_FILE_NAME}"`,
			"Cache-Control": CACHE_CONTROL,
		},
	});
}
