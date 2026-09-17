import { useCallback, useEffect, useRef, useState } from 'react';
import { PREFS_STORAGE_KEY } from '../constants/config.js';
import readable from '../data/readable.json';

function readStoredPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

/**
 * High contrast, font scale and read-aloud state for the accessibility
 * preferences panel. Persists contrast/fontScale to localStorage (theme and
 * motion are persisted by their own hooks under the same storage key, so
 * writes here merge rather than clobber).
 *
 * Read-aloud uses the browser's native SpeechSynthesis API: it never
 * autoplays, exposes play/pause/stop, and marks the currently-read section
 * with `data-reading="true"` (styled with a visible outline) so sighted
 * users can also see which passage is playing.
 */
export function useAccessibilityPreferences() {
  const [contrast, setContrast] = useState(() => !!(readStoredPrefs() || {}).contrast);
  const [motionOff, setMotionOff] = useState(() => !!(readStoredPrefs() || {}).motionOff);
  const [fontScale, setFontScaleState] = useState(() => (readStoredPrefs() || {}).fontScale || 'md');
  const [panelOpen, setPanelOpen] = useState(false);
  const [readTarget, setReadTargetState] = useState(readable[0]?.id || 'about');
  const [speak, setSpeak] = useState('idle'); // 'idle' | 'playing' | 'paused'
  const [speakStatus, setSpeakStatus] = useState('');
  const utteranceRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.contrast = contrast ? 'high' : 'normal';
  }, [contrast]);

  useEffect(() => {
    document.documentElement.dataset.motion = motionOff ? 'off' : 'on';
  }, [motionOff]);

  useEffect(() => {
    document.documentElement.dataset.fontscale = fontScale;
  }, [fontScale]);

  const persist = useCallback((patch) => {
    const saved = readStoredPrefs() || {};
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ ...saved, ...patch }));
    } catch {
      /* best-effort — preference still applies for this session */
    }
  }, []);

  const toggleContrast = useCallback(() => {
    setContrast((c) => {
      persist({ contrast: !c });
      return !c;
    });
  }, [persist]);

  const toggleMotion = useCallback(() => {
    setMotionOff((m) => {
      persist({ motionOff: !m });
      return !m;
    });
  }, [persist]);

  const setFontScale = useCallback(
    (key) => {
      setFontScaleState(key);
      persist({ fontScale: key });
    },
    [persist]
  );

  const markReading = useCallback((id) => {
    document.querySelectorAll('[data-reading]').forEach((el) => el.removeAttribute('data-reading'));
    if (id) document.getElementById(id)?.setAttribute('data-reading', 'true');
  }, []);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    markReading(null);
  }, [markReading]);

  const speakPlay = useCallback(() => {
    const synth = window.speechSynthesis;
    const target = readable.find((r) => r.id === readTarget) || readable[0];
    if (!synth) {
      setSpeakStatus('Your browser does not expose a speech voice. All spoken content is available as text on this page.');
      return;
    }
    if (speak === 'playing') {
      synth.pause();
      setSpeak('paused');
      setSpeakStatus('Paused: ' + target.label);
      return;
    }
    if (speak === 'paused') {
      synth.resume();
      setSpeak('playing');
      setSpeakStatus('Reading: ' + target.label);
      return;
    }
    const el = document.getElementById(target.id);
    if (!el) return;
    synth.cancel();
    const text = (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 4000);
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.onend = () => {
      markReading(null);
      setSpeak('idle');
      setSpeakStatus('Finished: ' + target.label);
    };
    u.onerror = () => {
      markReading(null);
      setSpeak('idle');
      setSpeakStatus('Playback stopped.');
    };
    utteranceRef.current = u;
    markReading(target.id);
    synth.speak(u);
    setSpeak('playing');
    setSpeakStatus('Reading: ' + target.label);
  }, [speak, readTarget, markReading]);

  const speakStop = useCallback(() => {
    stopSpeech();
    setSpeak('idle');
    setSpeakStatus('Stopped.');
  }, [stopSpeech]);

  const setReadTarget = useCallback(
    (id) => {
      stopSpeech();
      setReadTargetState(id);
      setSpeak('idle');
      setSpeakStatus('');
    },
    [stopSpeech]
  );

  const readSection = useCallback(
    (id) => {
      stopSpeech();
      setReadTargetState(id);
      setSpeak('idle');
      // Deferred so the panel/section render before we read from the DOM.
      requestAnimationFrame(() => speakPlay());
    },
    [stopSpeech, speakPlay]
  );

  useEffect(() => () => stopSpeech(), [stopSpeech]);

  return {
    contrast,
    toggleContrast,
    motionOff,
    toggleMotion,
    fontScale,
    setFontScale,
    panelOpen,
    openPanel: () => setPanelOpen(true),
    closePanel: () => setPanelOpen(false),
    togglePanel: () => setPanelOpen((v) => !v),
    readable,
    readTarget,
    setReadTarget,
    speak,
    speakStatus,
    speakPlay,
    speakStop,
    readSection,
  };
}
