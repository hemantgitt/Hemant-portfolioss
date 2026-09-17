import { useEffect, useRef } from 'react';

/**
 * Body-scroll lock + focus management for a dialog/modal. Locks scroll and
 * moves focus into the dialog while `isOpen` is true; on close, restores
 * scroll and returns focus to whatever triggered the dialog.
 *
 * The scroll-lock is written idempotently (always synced to `isOpen` on
 * every effect run, not diffed against a "previous" value) — a state-diff
 * version of this exact logic caused a real bug during the original site's
 * development where a stale previous-state snapshot left scroll locked
 * after closing.
 */
export function useModal(isOpen) {
  const dialogRef = useRef(null);
  const lastFocusRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      lastFocusRef.current = document.activeElement;
      const t = setTimeout(() => {
        dialogRef.current?.querySelector('button, a, [tabindex]')?.focus();
      }, 30);
      return () => clearTimeout(t);
    }

    if (lastFocusRef.current && typeof lastFocusRef.current.focus === 'function') {
      lastFocusRef.current.focus();
    }
    return undefined;
  }, [isOpen]);

  // Callers that unmount the dialog on close (rather than toggling `isOpen`
  // to false and keeping it mounted) never hit the isOpen=false branch
  // above, so restore scroll and focus here too.
  useEffect(
    () => () => {
      document.body.style.overflow = '';
      if (lastFocusRef.current && typeof lastFocusRef.current.focus === 'function') {
        lastFocusRef.current.focus();
      }
    },
    []
  );

  return dialogRef;
}
