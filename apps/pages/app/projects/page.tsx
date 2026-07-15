import { pageContent } from '@original/content';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '@/components/listing.css';
import { PageHeader } from '@/components/page-header';
import { projects } from '@/data/projects';
import { SITE_URL, withBasePath } from '@/data/site';

export const metadata: Metadata = {
  title: pageContent.projects.title,
  description: pageContent.projects.metadataDescription,
  alternates: { canonical: `${SITE_URL}/projects/` },
};

export default function ProjectsPage() {
  return (
    <main id="main-content" className="page-shell">
      <PageHeader
        eyebrow={`${projects.length} selected projects`}
        title={pageContent.projects.title}
        description={pageContent.projects.listingDescription}
      />
      <div className="projects-grid">
        {projects.map((project) => (
          <Link
            href={`/projects/${project.slug}/`}
            className="project-card"
            key={project.slug}
          >
            <div className="project-card-image">
              <Image
                src={withBasePath(project.image)}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
            <div className="project-card-copy">
              <div className="project-card-top">
                <span>{project.number}</span>
                <span>{project.year}</span>
              </div>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <div className="project-stack">
                {project.stack.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
