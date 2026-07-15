'use client';

import { pageContent } from '@original/content';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

export function Intro() {
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!container.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-intro-line]');
      gsap.set(lines, { opacity: 0.16 });
      gsap.to(lines, {
        opacity: 1,
        stagger: 0.8,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 60%',
          end: 'bottom 70%',
          scrub: true,
        },
      });
    }, container);
    return () => context.revert();
  }, []);

  return (
    <section className="intro" id="intro" ref={container}>
      <div className="intro-copy display">
        {pageContent.home.intro.map((line) => (
          <span data-intro-line key={line}>
            {line}
          </span>
        ))}
      </div>
    </section>
  );
}
