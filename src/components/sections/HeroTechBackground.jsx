import { BrandIcon } from '../BrandIcon.jsx';

// Fixed positions/sizes/delays (not randomized at runtime) so this renders
// identically on server and client and never causes a layout jump as icons
// "settle" into place -- every value here is deliberately chosen, not
// computed. Each icon drifts slowly via a CSS animation on .hero-tech-icon
// (see theme.css); real brand logos reuse the same bundled data Skills
// already loads, just also idle-loaded here.
const ICONS = [
  { slug: 'react', top: '8%', left: '4%', size: 34, dur: '22s', delay: '0s' },
  { slug: 'typescript', top: '62%', left: '2%', size: 28, dur: '26s', delay: '-4s' },
  { slug: 'nextdotjs', top: '18%', left: '88%', size: 30, dur: '24s', delay: '-9s' },
  { slug: 'tailwindcss', top: '78%', left: '90%', size: 26, dur: '20s', delay: '-2s' },
  { slug: 'vite', top: '4%', left: '48%', size: 24, dur: '18s', delay: '-11s' },
  { slug: 'graphql', top: '46%', left: '93%', size: 26, dur: '25s', delay: '-6s' },
  { slug: 'docker', top: '90%', left: '40%', size: 26, dur: '23s', delay: '-14s' },
  { slug: 'redux', top: '32%', left: '0%', size: 24, dur: '21s', delay: '-8s' },
];

/** Decorative, non-interactive layer of slowly-drifting real tech-stack
 * logos behind the Hero content -- a subtle "background texture" that
 * reinforces what the strengths tags already say, rather than literal
 * photography. Hidden from assistive tech and disabled entirely under
 * reduced motion (see .hero-tech-bg in theme.css). */
export function HeroTechBackground() {
  return (
    <div aria-hidden="true" className="hero-tech-bg">
      {ICONS.map((icon) => (
        <span
          key={icon.slug}
          className="hero-tech-icon"
          style={{ top: icon.top, left: icon.left, animationDuration: icon.dur, animationDelay: icon.delay }}
        >
          <BrandIcon slug={icon.slug} size={icon.size} />
        </span>
      ))}
    </div>
  );
}
