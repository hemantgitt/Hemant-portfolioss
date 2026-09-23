import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Header } from './components/Header.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.jsx';
import { AccessibilityPanel } from './components/AccessibilityPanel.jsx';
import { BackToTop } from './components/BackToTop.jsx';
import { UpdateBanner } from './components/UpdateBanner.jsx';
import { AboutSection } from './components/sections/AboutSection.jsx';
import { SkillsSection } from './components/sections/SkillsSection.jsx';
import { ExperienceSection } from './components/sections/ExperienceSection.jsx';
import { ProjectsSection } from './components/sections/ProjectsSection.jsx';
import { ImpactSection } from './components/sections/ImpactSection.jsx';
import { AccessibilitySection } from './components/sections/AccessibilitySection.jsx';
import { EngineeringSection } from './components/sections/EngineeringSection.jsx';
import { EducationSection } from './components/sections/EducationSection.jsx';
import { ContactSection } from './components/sections/ContactSection.jsx';
import { Footer } from './components/Footer.jsx';
import { useTheme } from './hooks/useTheme.js';
import { useServiceWorkerUpdate } from './hooks/useServiceWorkerUpdate.js';
import { useAccentColor } from './hooks/useAccentColor.js';
import { useAccessibilityPreferences } from './hooks/useAccessibilityPreferences.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import { useScrollSpy } from './hooks/useScrollSpy.js';
import nav from './data/nav.json';

const SECTION_IDS = nav.map((n) => n.href.slice(1));

export default function App() {
  const { isDark, toggleTheme } = useTheme('dark');
  const { accent, setAccent } = useAccentColor('purple');
  const a11y = useAccessibilityPreferences();
  const reducedMotion = useReducedMotion(a11y.motionOff);
  const { active, setActive, showBackToTop, suppress } = useScrollSpy(SECTION_IDS);
  const { updateAvailable, applyUpdate } = useServiceWorkerUpdate();
  const footerRef = useRef(null);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (a11y.panelOpen) a11y.closePanel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [a11y]);

  // The footer has its own "Back to top" button, so the fixed FAB (bottom-
  // right, same corner the footer's button sits in at page-bottom widths)
  // needs to step aside once the footer is on screen -- otherwise the two
  // visually collide/overlap right where a visitor is most likely to reach
  // for one of them.
  useEffect(() => {
    const el = footerRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const backToTopVisible = useMemo(
    () => showBackToTop && !a11y.panelOpen && !footerInView,
    [showBackToTop, a11y.panelOpen, footerInView]
  );

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
        <AboutSection reducedMotion={reducedMotion} />
        <SkillsSection reducedMotion={reducedMotion} />
        <ExperienceSection reducedMotion={reducedMotion} />
        <ProjectsSection reducedMotion={reducedMotion} />
        <ImpactSection reducedMotion={reducedMotion} />
        <AccessibilitySection reducedMotion={reducedMotion} onOpenPanel={a11y.openPanel} onReadAloud={handleReadAloudFromAccessibility} />
        <EngineeringSection reducedMotion={reducedMotion} />
        <EducationSection reducedMotion={reducedMotion} />
        <ContactSection reducedMotion={reducedMotion} />
      </main>

      <div ref={footerRef}>
        <Footer reducedMotion={reducedMotion} />
      </div>

      <BackToTop visible={backToTopVisible} onClick={scrollToTop} />

      {updateAvailable && <UpdateBanner onRefresh={applyUpdate} />}

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
