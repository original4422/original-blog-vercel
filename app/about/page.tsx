import { siteConfig } from '../../site.config';
import AboutTitle from './about-title';

export const metadata = {
	title: 'About',
	description: '关于 original 与这个数字花园',
	alternates: { canonical: `${siteConfig.url}/about` },
};

export default function Page() {
	return <AboutTitle />;
}
