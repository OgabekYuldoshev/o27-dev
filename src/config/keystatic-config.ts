import { collection, config, fields, singleton } from "@keystatic/core";

import { WORK_EXPERIENCE } from "./work-experience";

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
			Profile: ["resume"],
		},
	},
	singletons: {
		resume: singleton({
			label: "Resume",
			path: "content/resume",
			format: { data: "yaml" },
			schema: {
				headline: fields.text({
					label: "Headline",
					description: "Shown under your name at the top of the PDF.",
					validation: { isRequired: true },
				}),
				location: fields.text({
					label: "Location",
					description: "e.g. Tashkent, Uzbekistan (open to remote).",
				}),
				summary: fields.text({
					label: "Summary",
					description:
						"Two to four sentences about who you are and what you do.",
					multiline: true,
					validation: { isRequired: true },
				}),
				experience: fields.array(
					fields.object({
						job: fields.select({
							label: "Job",
							description:
								"Company, title and dates come from src/config/work-experience.ts.",
							options: WORK_EXPERIENCE.map((job) => ({
								label: `${job.company} — ${job.title}`,
								value: job.id,
							})),
							defaultValue: WORK_EXPERIENCE[0].id,
						}),
						highlights: fields.array(
							fields.text({ label: "Highlight", multiline: true }),
							{
								label: "Highlights",
								itemLabel: (props) => props.value,
							},
						),
					}),
					{
						label: "Experience highlights",
						description:
							"Achievement bullets per job. Jobs without an entry are still listed, without bullets.",
						itemLabel: (props) => props.fields.job.value,
					},
				),
				skills: fields.array(
					fields.object({
						category: fields.text({
							label: "Category",
							validation: { isRequired: true },
						}),
						items: fields.array(fields.text({ label: "Skill" }), {
							label: "Skills",
							itemLabel: (props) => props.value,
						}),
					}),
					{
						label: "Skills",
						itemLabel: (props) => props.fields.category.value,
					},
				),
				education: fields.array(
					fields.object({
						institution: fields.text({
							label: "Institution",
							validation: { isRequired: true },
						}),
						degree: fields.text({ label: "Degree / programme" }),
						start: fields.text({ label: "Start", description: "e.g. 2018" }),
						end: fields.text({
							label: "End",
							description: "e.g. 2022 or Present",
						}),
					}),
					{
						label: "Education",
						itemLabel: (props) => props.fields.institution.value,
					},
				),
				languages: fields.array(
					fields.object({
						name: fields.text({
							label: "Language",
							validation: { isRequired: true },
						}),
						level: fields.text({
							label: "Level",
							description: "e.g. Native, C1, Professional",
						}),
					}),
					{
						label: "Languages",
						itemLabel: (props) => props.fields.name.value,
					},
				),
			},
		}),
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
