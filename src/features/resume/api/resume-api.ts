import { SITE_CONFIG } from "@/config/site-config";
import { SOCIAL_LINKS } from "@/config/social-links";
import { WORK_EXPERIENCE } from "@/config/work-experience";
import { getProjects } from "@/features/projects";
import { contentReader } from "@/shared/lib/content-reader";

import type { Resume, ResumeLink } from "../types/resume";

/** Social profiles that belong on a CV; the rest of `SOCIAL_LINKS` stays on the site only. */
const RESUME_SOCIAL_LABELS = new Set(["Github", "LinkedIn", "Telegram"]);

/** Published projects listed under "Selected projects", newest first. */
const RESUME_PROJECT_LIMIT = 3;

function stripProtocol(url: string): string {
	return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function nonEmpty(values: readonly string[]): string[] {
	return values.map((value) => value.trim()).filter(Boolean);
}

/**
 * The resume as rendered into `/resume.pdf`. Identity, jobs and projects come
 * from the same sources as the site, so the PDF never drifts from the pages;
 * the Keystatic `resume` singleton only adds what the site does not show.
 */
export async function getResume(): Promise<Resume> {
	const [entry, projects] = await Promise.all([
		contentReader.singletons.resume.read(),
		getProjects(),
	]);

	const links: ResumeLink[] = SOCIAL_LINKS.filter((link) =>
		RESUME_SOCIAL_LABELS.has(link.label),
	).map((link) => ({ label: stripProtocol(link.href), href: link.href }));

	const highlightsByJob = new Map(
		(entry?.experience ?? []).map((item) => [
			item.job,
			nonEmpty(item.highlights),
		]),
	);

	return {
		name: SITE_CONFIG.name,
		headline: entry?.headline || SITE_CONFIG.role,
		location: entry?.location ?? "",
		summary: entry?.summary || SITE_CONFIG.description,
		email: SITE_CONFIG.email,
		website: { label: stripProtocol(SITE_CONFIG.url), href: SITE_CONFIG.url },
		links,
		experience: WORK_EXPERIENCE.map((job) => ({
			...job,
			highlights: highlightsByJob.get(job.id) ?? [],
		})),
		skills: (entry?.skills ?? [])
			.map((group) => ({
				category: group.category.trim(),
				items: nonEmpty(group.items),
			}))
			.filter((group) => group.category && group.items.length > 0),
		education: (entry?.education ?? []).map((item) => ({
			institution: item.institution,
			degree: item.degree,
			start: item.start,
			end: item.end,
		})),
		languages: (entry?.languages ?? []).map((item) => ({
			name: item.name,
			level: item.level,
		})),
		projects: projects.slice(0, RESUME_PROJECT_LIMIT).map((project) => ({
			title: project.title,
			description: project.description,
			href: project.href,
		})),
	};
}
