export type NavigationItem = {
	label: string;
	href: string;
};

export type SiteContent = {
	name: string;
	title: string;
	description: string;
	locale: string;
	language: string;
	email: string;
	github: string;
	githubHandle: string;
	navigation: NavigationItem[];
};

export type PostMetadata = {
	title: string;
	publishedAt: string;
	summary: string;
	draft: boolean;
	image?: string;
	tags: string[];
	featured?: boolean;
};

export type ContentPost = {
	slug: string;
	metadata: PostMetadata;
	content: string;
	source: string;
	headings: Array<{ id: string; text: string; level: number }>;
	readingTime: string;
};

export type ProjectImage = {
	src: string;
	alt: string;
};

export type Project = {
	slug: string;
	title: string;
	role: string;
	summary: string;
	subtitle: string;
	description: string;
	image: string;
	imageAlt: string;
	year: string;
	status: string;
	gallery: ProjectImage[];
	overviewSections?: Array<{
		title: string;
		body: string;
		image?: string;
		imageAlt?: string;
	}>;
	features: Array<{ title: string; description: string }>;
	techStack: Array<{ category: string; items: string[] }>;
	links: Array<{ label: string; href: string }>;
	usage: string[];
	targetUsers: string[];
	license: string;
};
