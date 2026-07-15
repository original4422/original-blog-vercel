import { pageContent } from '@original/content';
import { ArrowUpRight } from 'lucide-react';

import { siteConfig } from '@/data/site';

export function Contact() {
  return (
    <section className="contact">
      <p className="eyebrow">{pageContent.home.contact.eyebrow}</p>
      <h2 className="display">
        {pageContent.home.contact.lineOne}
        <br />
        <em>{pageContent.home.contact.lineTwo}</em>
      </h2>
      <a className="contact-link" href={`mailto:${siteConfig.email}`}>
        <span>
          <small>Email</small>
          {siteConfig.email}
        </span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    </section>
  );
}
