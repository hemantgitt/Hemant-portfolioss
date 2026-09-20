import { useCallback, useEffect, useState } from 'react';

/**
 * Registers the service worker and surfaces when a NEW version has finished
 * installing and is sitting in the "waiting" state (see sw.js — it no
 * longer calls skipWaiting() on its own, precisely so this can ask the
 * visitor first instead of silently swapping the active SW under an open
 * tab mid-session).
 *
 * @returns {{ updateAvailable: boolean, applyUpdate: () => void }}
 */
export function useServiceWorkerUpdate() {
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;

    let registration;

    const onUpdateFound = () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        // "installed" with an existing controller means this is a real
        // update sitting behind the currently-active SW, not the very
        // first install for a brand-new visitor (which has no controller
        // yet and proceeds straight to activation on its own).
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          setWaitingWorker(installing);
        }
      });
    };

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        registration = reg;
        if (reg.waiting && navigator.serviceWorker.controller) setWaitingWorker(reg.waiting);
        reg.addEventListener('updatefound', onUpdateFound);
      })
      .catch(() => {});

    // Once the new worker actually takes control, reload so the page picks
    // up the new build's JS/CSS instead of continuing to run the old one.
    let reloaded = false;
    const onControllerChange = () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      registration?.removeEventListener('updatefound', onUpdateFound);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    waitingWorker?.postMessage('SKIP_WAITING');
  }, [waitingWorker]);

  return { updateAvailable: !!waitingWorker, applyUpdate };
}
