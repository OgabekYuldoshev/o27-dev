/** A portfolio entry as listed on the projects index and the home page. */
export type ProjectSummary = {
	slug: string;
	title: string;
	description: string;
	/** ISO 8601 timestamp. */
	publishedAt: string;
	image: string;
	href: string;
};

/** A portfolio entry including its MDX body. */
export type Project = ProjectSummary & {
	content: string;
};
