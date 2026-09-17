import hero from '../../data/hero.json';
import site from '../../data/site.json';
import { StatCard } from '../StatCard.jsx';
import { Icon } from '../Icon.jsx';

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-h" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: '-20% -10%', background: 'radial-gradient(circle at 30% 20%, var(--hero-glow, var(--accent-tint)), transparent 55%)', pointerEvents: 'none' }}
      />
      <div className="split" style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px, 10vw, 120px) 20px 80px', display: 'grid', gap: 56, '--sa': '1.15fr', '--sb': '0.85fr' }}>
        <div style={{ display: 'grid', gap: 22, alignContent: 'start' }}>
          <p
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontFamily: 'var(--font-h)', fontWeight: 600,
              color: 'var(--accent)', background: 'var(--accent-tint)', padding: '7px 14px', borderRadius: 999, width: 'fit-content',
            }}
          >
            <span aria-hidden="true" className="status-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'block' }} />
            {hero.availabilityText}
          </p>
          <h1 id="hero-h" className="hero-name-in" style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', lineHeight: 1.03, letterSpacing: '-0.02em' }}>
            {hero.name}
          </h1>
          <p style={{ fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: 'clamp(1.05rem, 2.2vw, 1.45rem)', lineHeight: 1.3, color: 'var(--muted)' }}>
            {hero.title}
            <span style={{ color: 'var(--text)' }}> — {hero.titleSuffix}</span>
          </p>
          <p style={{ maxWidth: '56ch', fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--muted)' }}>{hero.summary}</p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {hero.strengths.map((s) => (
              <li key={s} style={{ fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.8rem', color: 'var(--text)', border: '1px solid var(--border)', padding: '7px 13px', borderRadius: 999 }}>
                {s}
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
            <a href="#projects" className="btn btn-primary" style={{ minHeight: 46, paddingInline: 22, fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)' }}>
              View my work
              <Icon name="arrow-down-right" size={15} />
            </a>
            <a href={site.resumeUrl} download={site.resumeDownloadName} className="btn btn-outline" style={{ minHeight: 46, paddingInline: 22, fontSize: '0.9rem' }}>
              <Icon name="download" size={15} />
              Download Resume
            </a>
            <a href="#contact" className="btn btn-outline" style={{ minHeight: 46, paddingInline: 22, fontSize: '0.9rem' }}>
              <Icon name="mail" size={15} />
              Contact me
            </a>
          </div>
        </div>
        <dl style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
          {hero.facts.map((f) => (
            <StatCard key={f.label} {...f} />
          ))}
        </dl>
      </div>
    </section>
  );
}
