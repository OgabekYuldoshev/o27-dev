import { contentReader } from "@/shared/lib/content-reader";
import { toIsoDateTime } from "@/shared/utils/to-iso-date-time";

import type { Post, PostSummary } from "../types/post";

const posts = contentReader.collections.posts;

/** Every published post, newest first. */
export async function getPosts(): Promise<PostSummary[]> {
	const entries = await posts.all();

	return entries
		.filter(({ entry }) => entry.status === "published")
		.map(({ slug, entry }) => ({
			slug,
			title: entry.title,
			description: entry.description,
			publishedAt: toIsoDateTime(entry.publishedAt),
		}))
		.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** A single published post including its MDX content, or `null` when there is none. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
	const entry = await posts.read(slug);

	if (!entry || entry.status !== "published") {
		return null;
	}

	return {
		slug,
		title: entry.title,
		description: entry.description,
		publishedAt: toIsoDateTime(entry.publishedAt),
		content: await entry.content(),
	};
}

/** Slugs of every published post, used to pre-render the post routes. */
export async function getPostSlugs(): Promise<string[]> {
	const entries = await getPosts();

	return entries.map((post) => post.slug);
}
