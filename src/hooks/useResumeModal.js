import { useState, useEffect, useCallback } from 'react';

// Port of legacy client/modules/modal.js — open/close state + ESC-key close,
// plus the body-scroll-lock side effect the original applied via classList.
export default function useResumeModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    document.body.classList.toggle('body-no-scroll', isOpen);
  }, [isOpen]);

  useEffect(() => {
    function handleKeyUp(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [close]);

  return { isOpen, open, close };
}
