import { join } from "node:path";

import { Font, renderToBuffer } from "@react-pdf/renderer";

import { SITE_CONFIG } from "@/config/site-config";

import { getResume } from "../api/resume-api";
import {
	RESUME_FONT_FAMILY,
	ResumeDocument,
} from "../components/resume-document";

const FONT_DIRECTORY = join(process.cwd(), "src/assets/fonts");

// Same family as the site and the social cards. Golos Text covers Latin and
// Cyrillic, so Uzbek and Russian text render without fallback glyphs.
Font.register({
	family: RESUME_FONT_FAMILY,
	fonts: [
		{ src: join(FONT_DIRECTORY, "GolosText-Regular.ttf"), fontWeight: 400 },
		{ src: join(FONT_DIRECTORY, "GolosText-SemiBold.ttf"), fontWeight: 600 },
	],
});

// The default hyphenation splits words mid-line with dashes, which reads badly
// in a CV and breaks keyword matching in applicant tracking systems.
Font.registerHyphenationCallback((word) => [word]);

/** Download name, e.g. `Ogabek-Yuldoshev-Resume.pdf`. */
export const RESUME_FILE_NAME = `${SITE_CONFIG.name.split(" ").join("-")}-Resume.pdf`;

/** Renders the resume to PDF bytes. Server-only: reads content and fonts from disk. */
export async function renderResumePdf(): Promise<Uint8Array<ArrayBuffer>> {
	const resume = await getResume();
	const buffer = await renderToBuffer(<ResumeDocument resume={resume} />);

	return new Uint8Array(buffer);
}
