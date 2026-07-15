import {
	type Project as ContentProject,
	projects as contentProjects,
} from '@original/content';
import type { Project } from './types';

export interface ProjectDetail extends ContentProject {
	deployedProjects?: Array<{
		title: string;
		role: string;
		summary: string;
		url: string;
		githubUrl: string;
		image?: string;
		imageAlt?: string;
	}>;
}

const colors = ['#fce7f3', '#e0f2fe', '#fef3c7', '#ede9fe'];

export const projects: Project[] = contentProjects.map((project, index) => ({
	title: project.title,
	image: project.image,
	color: colors[index % colors.length],
	slug: project.slug,
	role: project.role,
	summary: project.summary,
}));

export const projectDetails = Object.fromEntries(
	contentProjects.map((project) => [project.slug, project]),
) as Record<string, ProjectDetail>;
