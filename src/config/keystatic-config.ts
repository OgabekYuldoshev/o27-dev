import { collection, config, fields } from "@keystatic/core";

// The dashboard edits the working tree directly in development and commits to
// GitHub in production. The GitHub mode needs the `KEYSTATIC_GITHUB_CLIENT_ID`,
// `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and
// `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` environment variables.
const storage =
	process.env.NODE_ENV === "production"
		? ({
				kind: "github",
				repo: { owner: "OgabekYuldoshev", name: "o27-dev" },
			} as const)
		: ({ kind: "local" } as const);

const statusField = fields.select({
	label: "Status",
	description: "Only published entries appear on the site.",
	options: [
		{ label: "Published", value: "published" },
		{ label: "Draft", value: "draft" },
	],
	defaultValue: "draft",
});

const publishedAtField = fields.datetime({
	label: "Published at",
	description: "UTC. Entries are listed newest first.",
	defaultValue: { kind: "now" },
	validation: { isRequired: true },
});

const descriptionField = fields.text({
	label: "Description",
	description: "Shown in lists, search results and social cards.",
	multiline: true,
	validation: { isRequired: true },
});

export const keystaticConfig = config({
	storage,
	ui: {
		brand: { name: "o27.dev" },
		navigation: {
			Content: ["posts", "projects"],
		},
	},
	collections: {
		posts: collection({
			label: "Posts",
			slugField: "title",
			path: "content/posts/*",
			entryLayout: "content",
			format: { contentField: "content" },
			columns: ["title", "publishedAt", "status"],
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				status: statusField,
				publishedAt: publishedAtField,
				description: descriptionField,
				content: fields.mdx({
					label: "Content",
					extension: "mdx",
					options: {
						image: {
							directory: "public/images/posts",
							publicPath: "/images/posts/",
						},
					},
				}),
			},
		}),
		projects: collection({
			label: "Projects",
			slugField: "title",
			path: "content/projects/*",
			entryLayout: "content",
			format: { contentField: "content" },
			columns: ["title", "publishedAt", "status"],
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				status: statusField,
				publishedAt: publishedAtField,
				description: descriptionField,
				image: fields.image({
					label: "Cover image",
					description:
						"16:9 screenshot shown on the card and the project page.",
					directory: "public/images/projects",
					publicPath: "/images/projects/",
					validation: { isRequired: true },
				}),
				href: fields.url({
					label: "Link",
					description: "Live site or repository.",
					validation: { isRequired: true },
				}),
				content: fields.mdx({
					label: "Content",
					extension: "mdx",
					options: {
						image: {
							directory: "public/images/projects",
							publicPath: "/images/projects/",
						},
					},
				}),
			},
		}),
	},
});
