import { Suspense, lazy, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.jsx';
import { AccessibilityPanel } from './components/AccessibilityPanel.jsx';
import { BackToTop } from './components/BackToTop.jsx';
import { useTheme } from './hooks/useTheme.js';
import { useAccentColor } from './hooks/useAccentColor.js';
import { useAccessibilityPreferences } from './hooks/useAccessibilityPreferences.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import { useScrollSpy } from './hooks/useScrollSpy.js';
import nav from './data/nav.json';

// Below-the-fold sections are code-split so the initial bundle only ships
// what's needed to paint the hero. Each becomes its own chunk at build time.
const AboutSection = lazy(() => import('./components/sections/AboutSection.jsx').then((m) => ({ default: m.AboutSection })));
const SkillsSection = lazy(() => import('./components/sections/SkillsSection.jsx').then((m) => ({ default: m.SkillsSection })));
const ExperienceSection = lazy(() => import('./components/sections/ExperienceSection.jsx').then((m) => ({ default: m.ExperienceSection })));
const ProjectsSection = lazy(() => import('./components/sections/ProjectsSection.jsx').then((m) => ({ default: m.ProjectsSection })));
const ImpactSection = lazy(() => import('./components/sections/ImpactSection.jsx').then((m) => ({ default: m.ImpactSection })));
const PerformanceSection = lazy(() => import('./components/sections/PerformanceSection.jsx').then((m) => ({ default: m.PerformanceSection })));
const AccessibilitySection = lazy(() => import('./components/sections/AccessibilitySection.jsx').then((m) => ({ default: m.AccessibilitySection })));
const EngineeringSection = lazy(() => import('./components/sections/EngineeringSection.jsx').then((m) => ({ default: m.EngineeringSection })));
const EducationSection = lazy(() => import('./components/sections/EducationSection.jsx').then((m) => ({ default: m.EducationSection })));
const ContactSection = lazy(() => import('./components/sections/ContactSection.jsx').then((m) => ({ default: m.ContactSection })));
const Footer = lazy(() => import('./components/Footer.jsx').then((m) => ({ default: m.Footer })));

const SECTION_IDS = nav.map((n) => n.href.slice(1));

// A section-shaped placeholder keeps layout stable while a lazy chunk loads,
// instead of collapsing to zero height and causing layout shift (CLS).
function SectionFallback() {
  return <div aria-hidden="true" style={{ minHeight: 400 }} />;
}

export default function App() {
  const { isDark, toggleTheme } = useTheme('dark');
  const { accent, setAccent } = useAccentColor('purple');
  const a11y = useAccessibilityPreferences();
  const reducedMotion = useReducedMotion(a11y.motionOff);
  const { active, setActive, showBackToTop, suppress } = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (a11y.panelOpen) a11y.closePanel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [a11y]);

  const handleNavigate = useCallback(
    (id, suppressMs) => {
      suppress(suppressMs);
      setActive(id);
    },
    [suppress, setActive]
  );

  const scrollToTop = useCallback(() => {
    suppress(900);
    history.pushState(null, '', location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    setActive('home');
  }, [suppress, setActive, reducedMotion]);

  const handleReadAloudFromAccessibility = useCallback(() => {
    a11y.readSection('about');
  }, [a11y]);

  const backToTopVisible = useMemo(() => showBackToTop && !a11y.panelOpen, [showBackToTop, a11y.panelOpen]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-b)', display: 'flex', flexDirection: 'column' }}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <ScrollProgressBar />

      <Header
        active={active}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        accent={accent}
        onSetAccent={setAccent}
        onOpenA11yPanel={a11y.openPanel}
        panelOpen={a11y.panelOpen}
      />

      <main id="main" style={{ flex: 1 }}>
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <AboutSection reducedMotion={reducedMotion} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <SkillsSection reducedMotion={reducedMotion} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ExperienceSection reducedMotion={reducedMotion} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProjectsSection reducedMotion={reducedMotion} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ImpactSection reducedMotion={reducedMotion} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PerformanceSection reducedMotion={reducedMotion} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <AccessibilitySection reducedMotion={reducedMotion} onOpenPanel={a11y.openPanel} onReadAloud={handleReadAloudFromAccessibility} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <EngineeringSection reducedMotion={reducedMotion} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <EducationSection reducedMotion={reducedMotion} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection reducedMotion={reducedMotion} />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer reducedMotion={reducedMotion} />
      </Suspense>

      <BackToTop visible={backToTopVisible} onClick={scrollToTop} />

      {a11y.panelOpen && (
        <AccessibilityPanel
          onClose={a11y.closePanel}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          accent={accent}
          onSetAccent={setAccent}
          contrast={a11y.contrast}
          onToggleContrast={a11y.toggleContrast}
          motionOff={a11y.motionOff}
          onToggleMotion={a11y.toggleMotion}
          fontScale={a11y.fontScale}
          onSetFontScale={a11y.setFontScale}
          readable={a11y.readable}
          readTarget={a11y.readTarget}
          onSetReadTarget={a11y.setReadTarget}
          speak={a11y.speak}
          speakStatus={a11y.speakStatus}
          onSpeakPlay={a11y.speakPlay}
          onSpeakStop={a11y.speakStop}
        />
      )}
    </div>
  );
}
