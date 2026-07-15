import {
  projects as contentProjects,
  getProject as getContentProject,
} from '@original/content';

export type Project = {
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  year: string;
  status: string;
  stack: string[];
  highlights: string[];
  links: { label: string; href: string }[];
};

function toPagesProject(
  project: NonNullable<ReturnType<typeof getContentProject>>,
  index: number,
): Project {
  return {
    slug: project.slug,
    number: String(index + 1).padStart(2, '0'),
    eyebrow: project.role,
    title: project.title,
    summary: project.summary,
    description: project.description,
    image: project.image,
    imageAlt: project.imageAlt,
    year: project.year,
    status: project.status,
    stack: [...new Set(project.techStack.flatMap((group) => group.items))],
    highlights: project.features.map((feature) => feature.description),
    links: project.links,
  };
}

export const projects: Project[] = contentProjects.map(toPagesProject);

export function getProject(slug: string) {
  const project = getContentProject(slug);
  if (!project) return undefined;
  return toPagesProject(project, contentProjects.indexOf(project));
}
