import { pageContent, siteContent } from '@original/content';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/data/site';
import { FluidBackdrop } from './fluid-backdrop';

export function Hero() {
  const { hero } = pageContent.home;

  return (
    <FluidBackdrop>
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 className="display">
            {hero.headingPrefix} <em>{siteContent.name}</em>
          </h1>
          <p className="hero-role">{hero.role}</p>
          <div className="hero-notes">
            {hero.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
          <p className="hero-welcome">
            {hero.welcomePrefix} <span>{hero.welcomeEmphasis}</span>
            {hero.welcomeSuffix}
          </p>
        </div>

        <div className="hero-bottom">
          <div className="hero-socials">
            {siteConfig.socials.map((item) => (
              <a key={item.label} href={item.href} rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
          <p>{hero.location}</p>
        </div>
        <Link
          className="scroll-cue"
          href="#intro"
          aria-label={hero.scrollLabel}
        >
          <span>Scroll</span>
          <ArrowDown aria-hidden="true" />
        </Link>
      </div>
    </FluidBackdrop>
  );
}
