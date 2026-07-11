'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { projects } from './constants';
import ProjectItem from './project-item';
import ProjectPreview from './project-preview';
import type { ProjectModal } from './types';

export default function Projects() {
	const [modal, setModal] = useState<ProjectModal>({ active: false, index: 0 });

	return (
		<>
			{projects.map((project, index) => (
				<motion.div
					key={project.title}
					initial={{ scale: 0.8, opacity: 0, filter: 'blur(2px)' }}
					animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
					transition={{ duration: 0.6, delay: index / 10 }}
				>
					<ProjectItem
						index={index}
						title={project.title}
						url={project.url}
						slug={project.slug}
						role={project.role}
						summary={project.summary}
						setModal={setModal}
					/>
				</motion.div>
			))}
			<ProjectPreview modal={modal} projects={projects} />
		</>
	);
}
