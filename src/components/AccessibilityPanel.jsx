import { Icon } from './Icon.jsx';

const FONT_SCALES = [
  { key: 'md', label: 'Default' },
  { key: 'lg', label: 'Large' },
  { key: 'xl', label: 'Largest' },
];

/**
 * @param {{
 *   onClose: () => void, isDark: boolean, onToggleTheme: () => void,
 *   contrast: boolean, onToggleContrast: () => void,
 *   motionOff: boolean, onToggleMotion: () => void,
 *   fontScale: string, onSetFontScale: (key: string) => void,
 *   readable: {id:string,label:string}[], readTarget: string, onSetReadTarget: (id:string)=>void,
 *   speak: 'idle'|'playing'|'paused', speakStatus: string, onSpeakPlay: () => void, onSpeakStop: () => void,
 * }} props
 */
export function AccessibilityPanel({
  onClose,
  isDark,
  onToggleTheme,
  contrast,
  onToggleContrast,
  motionOff,
  onToggleMotion,
  fontScale,
  onSetFontScale,
  readable,
  readTarget,
  onSetReadTarget,
  speak,
  speakStatus,
  onSpeakPlay,
  onSpeakStop,
}) {
  const speakLabel = speak === 'playing' ? 'Pause' : speak === 'paused' ? 'Resume' : 'Play';
  const speakIcon = speak === 'playing' ? 'pause' : 'play';

  return (
    <div
      id="a11y-panel"
      role="region"
      aria-label="Accessibility preferences"
      style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 70, width: 'min(340px, calc(100vw - 40px))', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', borderRadius: 18, padding: 20, display: 'grid', gap: 18, maxHeight: 'min(80vh, 640px)', overflow: 'auto' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '1.05rem' }}>Accessibility preferences</h2>
        <button type="button" onClick={onClose} aria-label="Close accessibility preferences" className="icon-btn" style={{ width: 32, height: 32, flex: 'none' }}>
          <Icon name="x" size={15} />
        </button>
      </div>

      <fieldset style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 12, margin: 0, display: 'grid', gap: 10 }}>
        <legend style={{ fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 6px', color: 'var(--muted)' }}>Text size</legend>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FONT_SCALES.map((f) => {
            const active = fontScale === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={active}
                onClick={() => onSetFontScale(f.key)}
                style={{
                  minHeight: 38, flex: 1, borderRadius: 8, fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.82rem', cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? '#fff' : 'var(--text)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div style={{ display: 'grid', gap: 14 }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.87rem', cursor: 'pointer' }}>
          <input type="checkbox" aria-label="High contrast" checked={contrast} onChange={onToggleContrast} style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--accent)', flex: 'none' }} />
          <span>
            <strong style={{ fontFamily: 'var(--font-h)', fontWeight: 600 }}>High contrast</strong>
            <br />
            <span style={{ color: 'var(--muted)' }}>Pure black/white ground with stronger borders.</span>
          </span>
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.87rem', cursor: 'pointer' }}>
          <input type="checkbox" aria-label="Reduce motion" checked={motionOff} onChange={onToggleMotion} style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--accent)', flex: 'none' }} />
          <span>
            <strong style={{ fontFamily: 'var(--font-h)', fontWeight: 600 }}>Reduce motion</strong>
            <br />
            <span style={{ color: 'var(--muted)' }}>Removes reveal and transition animation. Your system setting is respected automatically.</span>
          </span>
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.87rem', cursor: 'pointer' }}>
          <input type="checkbox" aria-label="Dark theme" checked={isDark} onChange={onToggleTheme} style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--accent)', flex: 'none' }} />
          <span>
            <strong style={{ fontFamily: 'var(--font-h)', fontWeight: 600 }}>Dark theme</strong>
            <br />
            <span style={{ color: 'var(--muted)' }}>Turn off for the light ground.</span>
          </span>
        </label>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'grid', gap: 8 }}>
        <h3 style={{ fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>Read aloud</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Listen to a section. Nothing plays until you press play.</p>
        <div>
          <label htmlFor="read-pick" style={{ display: 'block', fontSize: '0.78rem', marginBottom: 5, color: 'var(--muted)' }}>
            Section
          </label>
          <select
            id="read-pick"
            value={readTarget}
            onChange={(e) => onSetReadTarget(e.target.value)}
            style={{ width: '100%', minHeight: 40, padding: '8px 10px', font: 'inherit', fontSize: '0.85rem', color: 'var(--text)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8 }}
          >
            {readable.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button type="button" onClick={onSpeakPlay} className="btn btn-primary" style={{ minHeight: 40, flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}>
            <Icon name={speakIcon} size={13} />
            {speakLabel}
          </button>
          <button type="button" onClick={onSpeakStop} disabled={speak === 'idle'} className="btn btn-outline" style={{ minHeight: 40, paddingInline: 12, fontSize: '0.82rem' }}>
            <Icon name="square" size={13} />
            Stop
          </button>
        </div>
        <p role="status" aria-live="polite" style={{ fontSize: '0.78rem', minHeight: '1.1em', color: 'var(--muted)' }}>
          {speakStatus}
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>Keyboard</h3>
        <ul style={{ paddingLeft: '1.1em', listStyle: 'disc', fontSize: '0.8rem', lineHeight: 1.55, color: 'var(--muted)' }}>
          <li>
            <strong style={{ color: 'var(--text)' }}>Tab</strong> / <strong style={{ color: 'var(--text)' }}>Shift+Tab</strong> — move between controls
          </li>
          <li>
            <strong style={{ color: 'var(--text)' }}>Enter</strong> / <strong style={{ color: 'var(--text)' }}>Space</strong> — activate
          </li>
          <li>
            <strong style={{ color: 'var(--text)' }}>Esc</strong> — close this panel, the menu or a case study
          </li>
        </ul>
      </div>
    </div>
  );
}
