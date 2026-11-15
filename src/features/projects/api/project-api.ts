import { contentReader } from "@/shared/lib/content-reader";
import { toIsoDateTime } from "@/shared/utils/to-iso-date-time";

import type { Project, ProjectSummary } from "../types/project";

const projects = contentReader.collections.projects;

/** Every published project, newest first. */
export async function getProjects(): Promise<ProjectSummary[]> {
	const entries = await projects.all();

	return entries
		.filter(({ entry }) => entry.status === "published")
		.map(({ slug, entry }) => ({
			slug,
			title: entry.title,
			description: entry.description,
			publishedAt: toIsoDateTime(entry.publishedAt),
			image: entry.image,
			href: entry.href,
		}))
		.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** A single published project including its MDX content, or `null` when there is none. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
	const entry = await projects.read(slug);

	if (!entry || entry.status !== "published") {
		return null;
	}

	return {
		slug,
		title: entry.title,
		description: entry.description,
		publishedAt: toIsoDateTime(entry.publishedAt),
		image: entry.image,
		href: entry.href,
		content: await entry.content(),
	};
}

/** Slugs of every published project, used to pre-render the project routes. */
export async function getProjectSlugs(): Promise<string[]> {
	const entries = await getProjects();

	return entries.map((project) => project.slug);
}
