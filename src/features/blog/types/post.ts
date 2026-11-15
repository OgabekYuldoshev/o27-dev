/** A blog entry as listed on the blog index and the home page. */
export type PostSummary = {
	slug: string;
	title: string;
	description: string;
	/** ISO 8601 timestamp. */
	publishedAt: string;
};

/** A blog entry including its MDX body. */
export type Post = PostSummary & {
	content: string;
};
