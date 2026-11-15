import { ProjectCard } from "./project-card";

import type { ProjectSummary } from "../types/project";

type ProjectListProps = {
	projects: ProjectSummary[];
};

export function ProjectList({ projects }: ProjectListProps) {
	return (
		<div className="flex flex-col gap-3">
			{projects.map((project) => (
				<ProjectCard key={project.slug} project={project} />
			))}
		</div>
	);
}
