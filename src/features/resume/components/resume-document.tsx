import {
	Document,
	Link,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import type { ReactNode } from "react";

import type { Resume } from "../types/resume";

// Site theme tokens resolved to sRGB, matching the social cards: the PDF
// renderer has no access to CSS variables.
const FOREGROUND = "#1a1c1a";
const MUTED_FOREGROUND = "#5c625c";
const PRIMARY = "#4a634e";
const BORDER = "#d1d5d1";

export const RESUME_FONT_FAMILY = "Golos Text";

const styles = StyleSheet.create({
	page: {
		paddingVertical: 40,
		paddingHorizontal: 44,
		fontFamily: RESUME_FONT_FAMILY,
		fontSize: 10,
		lineHeight: 1.45,
		color: FOREGROUND,
	},
	name: {
		fontSize: 24,
		fontWeight: 600,
		letterSpacing: -0.5,
		// The page's relative line height is resolved against the body size,
		// so the large heading needs its own or it overlaps the headline.
		lineHeight: 1.2,
	},
	headline: {
		marginTop: 4,
		fontSize: 12,
		color: PRIMARY,
		fontWeight: 600,
	},
	contacts: {
		marginTop: 8,
		flexDirection: "row",
		flexWrap: "wrap",
		color: MUTED_FOREGROUND,
	},
	contactItem: {
		marginRight: 12,
	},
	link: {
		color: MUTED_FOREGROUND,
		textDecoration: "none",
	},
	section: {
		marginTop: 16,
	},
	sectionTitle: {
		marginBottom: 6,
		paddingBottom: 3,
		borderBottomWidth: 1,
		borderBottomColor: BORDER,
		fontSize: 9,
		fontWeight: 600,
		letterSpacing: 1.5,
		textTransform: "uppercase",
		color: PRIMARY,
	},
	entry: {
		marginBottom: 8,
	},
	entryHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	entryTitle: {
		fontWeight: 600,
	},
	entryLink: {
		fontWeight: 600,
		color: FOREGROUND,
		textDecoration: "none",
	},
	entryMeta: {
		color: MUTED_FOREGROUND,
	},
	bullet: {
		flexDirection: "row",
		marginTop: 2,
	},
	bulletMark: {
		width: 10,
		color: PRIMARY,
	},
	bulletText: {
		flex: 1,
	},
	skillRow: {
		flexDirection: "row",
		marginBottom: 3,
	},
	skillCategory: {
		width: 110,
		fontWeight: 600,
	},
	skillItems: {
		flex: 1,
	},
	muted: {
		color: MUTED_FOREGROUND,
	},
});

type SectionProps = {
	title: string;
	children: ReactNode;
};

function Section({ title, children }: SectionProps) {
	return (
		<View style={styles.section}>
			{/* Keep each heading on the same page as at least its first entry. */}
			<Text style={styles.sectionTitle} minPresenceAhead={40}>
				{title}
			</Text>
			{children}
		</View>
	);
}

function formatPeriod(start: string, end: string): string {
	return [start, end].filter(Boolean).join(" – ");
}

type ResumeDocumentProps = {
	resume: Resume;
};

/**
 * Single-column, text-only layout: applicant tracking systems parse it
 * reliably and it prints cleanly on A4 and Letter.
 */
export function ResumeDocument({ resume }: ResumeDocumentProps) {
	return (
		<Document
			title={`${resume.name} — Resume`}
			author={resume.name}
			subject={resume.headline}
			keywords={resume.skills.flatMap((group) => group.items).join(", ")}
			creator={resume.website.label}
			producer={resume.website.label}
			language="en"
		>
			<Page size="A4" style={styles.page}>
				<View>
					<Text style={styles.name}>{resume.name}</Text>
					<Text style={styles.headline}>{resume.headline}</Text>
					<View style={styles.contacts}>
						{resume.location ? (
							<Text style={styles.contactItem}>{resume.location}</Text>
						) : null}
						<Link
							style={[styles.link, styles.contactItem]}
							src={`mailto:${resume.email}`}
						>
							{resume.email}
						</Link>
						<Link
							style={[styles.link, styles.contactItem]}
							src={resume.website.href}
						>
							{resume.website.label}
						</Link>
						{resume.links.map((link) => (
							<Link
								key={link.href}
								style={[styles.link, styles.contactItem]}
								src={link.href}
							>
								{link.label}
							</Link>
						))}
					</View>
				</View>

				<Section title="Summary">
					<Text>{resume.summary}</Text>
				</Section>

				<Section title="Experience">
					{resume.experience.map((job) => (
						<View key={job.id} style={styles.entry} wrap={false}>
							<View style={styles.entryHeader}>
								<Text style={styles.entryTitle}>
									{job.title} · {job.company}
								</Text>
								<Text style={styles.entryMeta}>
									{formatPeriod(job.start, job.end)}
								</Text>
							</View>
							{job.highlights.map((highlight) => (
								<View key={highlight} style={styles.bullet}>
									<Text style={styles.bulletMark}>•</Text>
									<Text style={styles.bulletText}>{highlight}</Text>
								</View>
							))}
						</View>
					))}
				</Section>

				{resume.skills.length > 0 ? (
					<Section title="Skills">
						{resume.skills.map((group) => (
							<View key={group.category} style={styles.skillRow}>
								<Text style={styles.skillCategory}>{group.category}</Text>
								<Text style={styles.skillItems}>{group.items.join(", ")}</Text>
							</View>
						))}
					</Section>
				) : null}

				{resume.projects.length > 0 ? (
					<Section title="Selected projects">
						{resume.projects.map((project) => (
							<View key={project.href} style={styles.entry} wrap={false}>
								<Link style={styles.entryLink} src={project.href}>
									{project.title}
								</Link>
								<Text style={styles.muted}>{project.description}</Text>
							</View>
						))}
					</Section>
				) : null}

				{resume.education.length > 0 ? (
					<Section title="Education">
						{resume.education.map((item) => (
							<View
								key={`${item.institution}-${item.start}`}
								style={styles.entry}
								wrap={false}
							>
								<View style={styles.entryHeader}>
									<Text style={styles.entryTitle}>{item.institution}</Text>
									<Text style={styles.entryMeta}>
										{formatPeriod(item.start, item.end)}
									</Text>
								</View>
								{item.degree ? (
									<Text style={styles.muted}>{item.degree}</Text>
								) : null}
							</View>
						))}
					</Section>
				) : null}

				{resume.languages.length > 0 ? (
					<Section title="Languages">
						<Text>
							{resume.languages
								.map((language) =>
									language.level
										? `${language.name} (${language.level})`
										: language.name,
								)
								.join(" · ")}
						</Text>
					</Section>
				) : null}
			</Page>
		</Document>
	);
}
