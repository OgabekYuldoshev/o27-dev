export type ResumeLink = {
	label: string;
	href: string;
};

export type ResumeExperience = {
	id: string;
	company: string;
	title: string;
	start: string;
	end: string;
	href?: string;
	highlights: string[];
};

export type ResumeSkillGroup = {
	category: string;
	items: string[];
};

export type ResumeEducation = {
	institution: string;
	degree: string;
	start: string;
	end: string;
};

export type ResumeLanguage = {
	name: string;
	level: string;
};

export type ResumeProject = {
	title: string;
	description: string;
	href: string;
};

/** Everything the PDF renders, merged from the site config and the Keystatic `resume` singleton. */
export type Resume = {
	name: string;
	headline: string;
	location: string;
	summary: string;
	email: string;
	website: ResumeLink;
	links: ResumeLink[];
	experience: ResumeExperience[];
	skills: ResumeSkillGroup[];
	education: ResumeEducation[];
	languages: ResumeLanguage[];
	projects: ResumeProject[];
};
